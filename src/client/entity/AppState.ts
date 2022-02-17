import { Drawable } from './entities';
import { glUtils } from '../libs/glUtils';
import { setupListeners } from '../libs/listener';
import { AppStateMode, DrawableType, Position } from '../typings';
import FragmentShaderSource from '../shaders/FragmentShader.glsl';
import VertexShaderSource from '../shaders/VertexShader.glsl';
import { generateSquareVertices, generateRectangleVertices } from '../libs/math';

const canvas = document.querySelector('canvas');
if (!canvas) {
  throw new Error('Canvas not found!');
}
const gl = glUtils.checkWebGL(canvas);

class AppState {
  private mode: AppStateMode = 'IDLE';
  private shape: DrawableType = 'RECTANGLE';
  private gl: WebGLRenderingContext;
  private drawables: Drawable[];
  private vertexShader: WebGLShader;
  private fragmentShader: WebGLShader;
  private program: WebGLProgram;

  constructor() {
    this.gl = gl;
    this.drawables = [];
    this.vertexShader = glUtils.getShader(gl, gl.VERTEX_SHADER, VertexShaderSource);
    this.fragmentShader = glUtils.getShader(gl, gl.FRAGMENT_SHADER, FragmentShaderSource);
    this.program = glUtils.createProgram(gl, this.vertexShader, this.fragmentShader);
    setupListeners(this);
  }

  public run() {
    const program = this.program;

    const coordinates = generateRectangleVertices({ x: 100, y: 200 }, { x: 300, y: 800 });
    const rectangle = new Drawable(gl, program, gl.TRIANGLES, [0.0, 0.3, 0.0, 1.0], coordinates);

    const coordinates2 = generateRectangleVertices({ x: 200, y: 100 }, { x: 800, y: 300 });
    const rectangle2 = new Drawable(gl, program, gl.TRIANGLES, [0.0, 0.3, 0.0, 1.0], coordinates2);

    this.addDrawable(rectangle);
    this.addDrawable(rectangle2);

    requestAnimationFrame(this.render.bind(this));
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

  private setIdle() {
    this.mode = 'IDLE';
  }

  private setDrawing(shape: DrawableType) {
    this.mode = 'DRAWING';
    this.shape = shape;
  }
}

export default AppState;
