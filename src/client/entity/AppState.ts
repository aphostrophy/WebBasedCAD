import { Drawable } from './entities';
import { glUtils } from '../libs/glUtils';
import { setupListeners } from '../libs/listener';
import { AppStateMode, DrawableType, Position } from '../typings';
import FragmentShaderSource from '../shaders/FragmentShader.glsl';
import VertexShaderSource from '../shaders/VertexShader.glsl';
import { createSquare, generateRectangleVertices } from '../libs/math';

const canvas = document.querySelector('canvas');
if (!canvas) {
  throw new Error('Canvas not found!');
}
const gl = glUtils.checkWebGL(canvas);

class AppState {
  private mode: AppStateMode = 'IDLE';
  private shape: DrawableType = 'RECTANGLE';
  private gl: WebGLRenderingContext = gl;
  private drawables: Drawable[];
  private vertexShader: WebGLShader;
  private fragmentShader: WebGLShader;

  constructor() {
    this.drawables = [];
    this.vertexShader = glUtils.getShader(gl, gl.VERTEX_SHADER, VertexShaderSource);
    this.fragmentShader = glUtils.getShader(gl, gl.FRAGMENT_SHADER, FragmentShaderSource);
    setupListeners(this);
  }

  public run() {
    const vertexShader = this.vertexShader;
    const fragmentShader = this.fragmentShader;

    const program = glUtils.createProgram(gl, vertexShader, fragmentShader);

    const coordinates = generateRectangleVertices({ x: 100, y: 200 }, { x: 300, y: 800 });
    const rectangle = new Drawable(gl, program, gl.TRIANGLES, [0.0, 0.3, 0.0, 1.0], coordinates);
    rectangle.draw();

    const coordinates2 = generateRectangleVertices({ x: 200, y: 100 }, { x: 800, y: 300 });
    const rectangle2 = new Drawable(gl, program, gl.TRIANGLES, [0.0, 0.3, 0.0, 1.0], coordinates2);
    rectangle2.draw();
  }

  public setIdle() {
    this.mode = 'IDLE';
  }

  public setDrawing(shape: DrawableType) {
    this.mode = 'DRAWING';
    this.shape = shape;
  }
}

export default AppState;
