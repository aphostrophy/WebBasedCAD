import { Drawable } from './entities';
import DOMHandler from './DOMHandler';
import { glUtils } from '../libs/glUtils';
import { setupListeners } from '../libs/listener';
import { AppStateMode, DrawableType, Position, Vec4 } from '../typings';
import FragmentShaderSource from '../shaders/FragmentShader.glsl';
import VertexShaderSource from '../shaders/VertexShader.glsl';
import {
  generateSquareVertices,
  generateRectangleVertices,
  generateLineVertices,
  generatePolygonVertices,
} from '../libs/math';

class AppState {
  private mode: AppStateMode = 'IDLE';
  private shape: DrawableType = 'LINE';
  private colorVector: Vec4 = [0.0, 0.0, 0.0, 1.0];
  private gl: WebGLRenderingContext;
  private drawables: Drawable[];
  private vertexShader: WebGLShader;
  private fragmentShader: WebGLShader;
  private program: WebGLProgram;
  private domHandler: DOMHandler;

  private realMousePosition: Position;

  private pendingVertices: Position[];

  constructor() {
    this.domHandler = new DOMHandler();
    this.gl = this.domHandler.getGl();

    this.drawables = [];
    this.vertexShader = glUtils.getShader(this.gl, this.gl.VERTEX_SHADER, VertexShaderSource);
    this.fragmentShader = glUtils.getShader(this.gl, this.gl.FRAGMENT_SHADER, FragmentShaderSource);
    this.program = glUtils.createProgram(this.gl, this.vertexShader, this.fragmentShader);
    this.pendingVertices = [];
    this.realMousePosition = { x: 0, y: 0 };
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
    for (let i = 0; i < this.drawables.length; i++) {
      const drawable = this.drawables[i];
      drawable.draw();
    }

    if (this.pendingVertices.length > 0) {
      const helperLineCoordinates = generateLineVertices(
        this.pendingVertices[0],
        this.realMousePosition
      );
      const helperLine = new Drawable(
        this.gl,
        this.program,
        this.gl.LINES,
        this.colorVector,
        helperLineCoordinates
      );
      helperLine.draw();
    }
  }

  private addDrawable(drawable: Drawable) {
    this.drawables.push(drawable);
    if (this.shape !== 'POLYGON') {
      this.clearPendingVertices();
    } 
  }

  public getAppStateMode() {
    return this.mode;
  }

  public setIdle() {
    this.mode = 'IDLE';

    this.pendingVertices = [];
    this.domHandler.setAppStateMode(this.mode);
  }

  public setDrawing() {
    this.mode = 'DRAWING';

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

    if (this.shape === 'POLYGON' && this.pendingVertices.length >= 3) {
      this.submitDrawing();
    }
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
        coordinates
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
        coordinates
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
        coordinates
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
        coordinates
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
}

export default AppState;
