import { Drawable } from './entities';
import DOMHandler from './DOMHandler';
import { glUtils } from '../libs/glUtils';
import { setupListeners } from '../libs/listener';
import { AppStateMode, DrawableType, Position } from '../typings';
import FragmentShaderSource from '../shaders/FragmentShader.glsl';
import VertexShaderSource from '../shaders/VertexShader.glsl';
import { generateSquareVertices, generateRectangleVertices } from '../libs/math';

class AppState {
  private mode: AppStateMode = 'IDLE';
  private shape: DrawableType = 'RECTANGLE';
  private gl: WebGLRenderingContext;
  private drawables: Drawable[];
  private vertexShader: WebGLShader;
  private fragmentShader: WebGLShader;
  private program: WebGLProgram;
  private domHandler: DOMHandler;

  constructor() {
    this.domHandler = new DOMHandler();
    this.gl = this.domHandler.getGl();

    this.drawables = [];
    this.vertexShader = glUtils.getShader(this.gl, this.gl.VERTEX_SHADER, VertexShaderSource);
    this.fragmentShader = glUtils.getShader(this.gl, this.gl.FRAGMENT_SHADER, FragmentShaderSource);
    this.program = glUtils.createProgram(this.gl, this.vertexShader, this.fragmentShader);
    setupListeners(this);
  }

  public run() {
    const program = this.program;

    this.setupCanvas();

    const coordinates = generateRectangleVertices({ x: 100, y: 200 }, { x: 300, y: 800 });
    const rectangle = new Drawable(
      this.gl,
      program,
      this.gl.TRIANGLES,
      [0.0, 0.3, 0.0, 1.0],
      coordinates
    );

    const coordinates2 = generateRectangleVertices({ x: 200, y: 100 }, { x: 800, y: 300 });
    const rectangle2 = new Drawable(
      this.gl,
      program,
      this.gl.TRIANGLES,
      [0.0, 0.3, 0.0, 1.0],
      coordinates2
    );

    this.addDrawable(rectangle);
    this.addDrawable(rectangle2);

    requestAnimationFrame(this.render.bind(this));
  }

  private setupCanvas() {
    const gl = this.gl;
    (this.domHandler.canvas as HTMLCanvasElement).width = window.innerWidth;
    (this.domHandler.canvas as HTMLCanvasElement).height = window.innerHeight;
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
  }

  private addDrawable(drawable: Drawable) {
    this.drawables.push(drawable);
  }

  public getAppStateMode() {
    return this.mode;
  }

  public setIdle() {
    this.mode = 'IDLE';

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
  }

  public getDOMHandler() {
    return this.domHandler;
  }
}

export default AppState;
