import { Drawable } from './entities';
import FileManager from './FileManager';
import DOMHandler from './DOMHandler';
import { glUtils } from '../libs/glUtils';
import { setupListeners } from '../libs/listener';
import { AppStateMode, DrawablePrimitives, DrawableType, Position, Vec4 } from '../typings';
import FragmentShaderSource from '../shaders/FragmentShader.glsl';
import VertexShaderSource from '../shaders/VertexShader.glsl';
import {
  generateSquareVertices,
  generateRectangleVertices,
  generateLineVertices,
  generatePolygonVertices,
  insideSquare,
  insidePolygon,
  insideLine,
  generatePointVertice,
} from '../libs/math';

class AppState {
  private mode: AppStateMode = 'IDLE';
  private shape: DrawableType = 'LINE';
  private colorVector: Vec4 = [0.0, 0.0, 0.0, 1.0];
  private gl: WebGLRenderingContext;
  private drawables: Drawable[];
  private fileManager: FileManager;
  private vertexShader: WebGLShader;
  private fragmentShader: WebGLShader;
  private program: WebGLProgram;
  private domHandler: DOMHandler;
  private selectedIndex: number;

  private realMousePosition: Position;

  private pendingVertices: Position[];

  constructor() {
    this.domHandler = new DOMHandler();
    this.gl = this.domHandler.getGl();

    this.drawables = [];
    this.fileManager = new FileManager();

    this.vertexShader = glUtils.getShader(this.gl, this.gl.VERTEX_SHADER, VertexShaderSource);
    this.fragmentShader = glUtils.getShader(this.gl, this.gl.FRAGMENT_SHADER, FragmentShaderSource);
    this.program = glUtils.createProgram(this.gl, this.vertexShader, this.fragmentShader);
    this.pendingVertices = [];
    this.realMousePosition = { x: 0, y: 0 };
    this.selectedIndex = -1;
    this.initDebugger();
    setupListeners(this);
  }

  private initDebugger() {
    this.domHandler.setAppStateMode(this.mode);
    this.domHandler.setDrawShape(this.shape);
    this.domHandler.setColor('#000000');
  }

  public run() {
    this.setupCanvas();

    requestAnimationFrame(this.render.bind(this));
  }

  private setupCanvas() {
    const gl = this.gl;
    (this.domHandler.canvas as HTMLCanvasElement).width = window.innerWidth;
    (this.domHandler.canvas as HTMLCanvasElement).height = window.innerHeight;
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  }

  private render(now: number) {
    this.draw();
    requestAnimationFrame(this.render.bind(this));
  }

  private draw() {
    // draw shapes
    for (let i = 0; i < this.drawables.length; i++) {
      const drawable = this.drawables[i];
      drawable.draw();
    }

    //draw points on selected shape
    if (this.selectedIndex != -1) {
      // Draw square on each vertices
      const selectedDrawable = this.drawables[this.selectedIndex];
      for (var i = 0; i < selectedDrawable.vertices.length; i++) {
        const coordinates = generatePointVertice(selectedDrawable.vertices[i]);
        const tempSquare = new Drawable(
          this.gl,
          this.program,
          this.gl.TRIANGLE_FAN,
          this.colorVector,
          coordinates,
          'SQUARE'
        );
        tempSquare.drawVertices();
      }
    }

    //draw helper line for pending shape
    if (this.pendingVertices.length > 0) {
      for (let i = 0; i < this.pendingVertices.length; i++) {
        if (i == this.pendingVertices.length - 1) {
          const helperLineCoordinates = generateLineVertices(
            this.pendingVertices[i],
            this.realMousePosition
          );
          const helperLine = new Drawable(
            this.gl,
            this.program,
            this.gl.LINES,
            this.colorVector,
            helperLineCoordinates,
            'LINE'
          );
          helperLine.draw();
        } else {
          const helperLineCoordinates = generateLineVertices(
            this.pendingVertices[i],
            this.pendingVertices[i + 1]
          );
          const helperLine = new Drawable(
            this.gl,
            this.program,
            this.gl.LINES,
            this.colorVector,
            helperLineCoordinates,
            'LINE'
          );
          helperLine.draw();
        }
      }
    }
  }

  private addDrawable(drawable: Drawable) {
    this.drawables.push(drawable);
    this.clearPendingVertices();
  }

  public getAppStateMode() {
    return this.mode;
  }

  public setIdle() {
    this.mode = 'IDLE';

    this.pendingVertices = [];
    this.selectedIndex = -1;
    this.domHandler.setAppStateMode(this.mode);
  }

  public setDrawing() {
    this.mode = 'DRAWING';

    this.domHandler.setAppStateMode(this.mode);
  }

  public setSelecting() {
    this.mode = 'SELECTING';

    this.pendingVertices = [];
    this.domHandler.setAppStateMode(this.mode);
  }

  public setMousePosition(clientPos: Position, realPos: Position) {
    const { x: clientX, y: clientY } = clientPos;
    const { x: realX, y: realY } = realPos;

    this.domHandler.setMousePosition({ x: clientX, y: clientY });
    this.realMousePosition = { x: realX, y: realY };
  }

  public setColor(colorHex: string) {
    const colorStringArray = (colorHex.slice(1, colorHex.length).match(/.{2}/g) || []).concat([
      'ff',
    ]);
    const colorVector: Vec4 = [0, 0, 0, 0];

    for (let i = 0; i < colorStringArray.length; i++) {
      colorVector[i] = parseInt(colorStringArray[i], 16) / 255;
    }
    this.colorVector = colorVector;
    this.domHandler.setColor(colorHex);
  }

  public addVertex(realPos: Position) {
    this.pendingVertices.push(realPos);

    if (this.shape !== 'POLYGON' && this.pendingVertices.length == 2) {
      this.submitDrawing();
    }

    // if (this.shape === 'POLYGON' && this.pendingVertices.length >= 3) {
    //   this.submitDrawing();
    // }
  }

  public submitDrawing() {
    if (this.pendingVertices.length < 2) {
      alert('not enough vertices!');
      return;
    }

    if (this.shape === 'LINE') {
      const coordinates = generateLineVertices(this.pendingVertices[0], this.pendingVertices[1]);
      const line = new Drawable(
        this.gl,
        this.program,
        this.gl.LINES,
        this.colorVector,
        coordinates,
        'LINE'
      );
      this.addDrawable(line);
    }

    if (this.shape === 'SQUARE') {
      const firstPoint = this.pendingVertices[0];
      const coordinates = generateSquareVertices(
        firstPoint,
        this.realMousePosition.x - firstPoint.x,
        this.realMousePosition.y - firstPoint.y
      );

      const square = new Drawable(
        this.gl,
        this.program,
        this.gl.TRIANGLE_FAN,
        this.colorVector,
        coordinates,
        'SQUARE'
      );
      this.addDrawable(square);
    }

    if (this.shape === 'RECTANGLE') {
      const coordinates = generateRectangleVertices(
        this.pendingVertices[0],
        this.pendingVertices[1]
      );
      const rectangle = new Drawable(
        this.gl,
        this.program,
        this.gl.TRIANGLE_FAN,
        this.colorVector,
        coordinates,
        'RECTANGLE'
      );
      this.addDrawable(rectangle);
    }

    if (this.shape === 'POLYGON') {
      const coordinates = generatePolygonVertices(this.pendingVertices);
      const polygon = new Drawable(
        this.gl,
        this.program,
        this.gl.TRIANGLE_FAN,
        this.colorVector,
        coordinates,
        'POLYGON'
      );
      this.addDrawable(polygon);
    }
  }

  public clearPendingVertices() {
    this.pendingVertices = [];
  }

  public getDOMHandler() {
    return this.domHandler;
  }

  public setDrawShape(shape: DrawableType) {
    this.shape = shape;
    this.domHandler.setDrawShape(shape);
  }

  public resetCanvas() {
    this.gl.clearColor(1.0, 1.0, 1.0, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.drawables = [];
    this.pendingVertices = [];
  }

  public selectShape(pos: Position) {
    var inside = false;

    for (let i = this.drawables.length - 1; i >= 0; i--) {
      var drawable = this.drawables[i];
      if (drawable.shape == 'LINE') {
        if (insideLine(drawable.vertices, pos)) {
          this.selectedIndex = i;
          inside = true;
          console.log('DI DALAM GARIS');
          break;
        }
      } else if (drawable.shape == 'SQUARE' || drawable.shape == 'RECTANGLE') {
        if (insideSquare(drawable.vertices, pos)) {
          this.selectedIndex = i;
          inside = true;
          console.log('DI DALAM PERSEGI');
          break;
        }
      } else {
        if (insidePolygon(drawable.vertices, drawable.anchorPoint, pos)) {
          this.selectedIndex = i;
          inside = true;
          console.log('DI DALAM POLYGON');
          break;
        }
      }
    }

    if (!inside) {
      this.selectedIndex = -1;
    }
  }

  /**
   * Save and Load File Handling
   */

  public getDrawablesPrimitives(): DrawablePrimitives[] {
    const data: DrawablePrimitives[] = [];

    for (const drawable of this.drawables) {
      const drawableData: DrawablePrimitives = {
        vertices: drawable.vertices,
        colorVector: drawable.colorVector,
        type: drawable.type,
        shape: drawable.shape,
      };
      data.push(drawableData);
    }

    return data;
  }

  public save() {
    this.fileManager.saveAppState(this);
  }

  public load() {
    this.resetCanvas();
    this.fileManager.loadAppState(this);
  }

  public populateDrawables(drawablesPrimitives: DrawablePrimitives[]) {
    for (const drawablePrimitive of drawablesPrimitives) {
      const vertices: number[] = [];
      for (const vertex of drawablePrimitive.vertices) {
        vertices.push(vertex.x);
        vertices.push(vertex.y);
      }
      const drawable = new Drawable(
        this.gl,
        this.program,
        drawablePrimitive.type,
        drawablePrimitive.colorVector,
        vertices,
        drawablePrimitive.shape
      );
      this.addDrawable(drawable);
    }
  }
}

export default AppState;
