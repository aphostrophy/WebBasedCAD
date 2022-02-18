import { NativePosition, Vec2, Vec4 } from '../typings';
import { ITEM_SIZE } from '../libs/constant';

class Drawable {
  private gl: WebGLRenderingContext;
  private program: WebGLProgram;
  public vertices: NativePosition[];
  public type: number;
  public colorVector: Vec4;
  public anchorPoint: Vec2;

  constructor(
    gl: WebGLRenderingContext,
    program: WebGLProgram,
    type: number,
    colorVector: Vec4,
    vertices: number[]
  ) {
    this.gl = gl;
    this.program = program;
    this.type = type;
    this.colorVector = colorVector;
    this.vertices = [];
    for (let i = 0; i < vertices.length; i += 2) {
      this.vertices.push({ x: vertices[i], y: vertices[i + 1] });
    }
    this.anchorPoint = this.calculateAnchorPoint();
  }

  bindBuffer() {
    const gl = this.gl;
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(this._flattenVertices(this.vertices)),
      gl.DYNAMIC_DRAW
    );
  }

  draw() {
    this.bindBuffer();
    const gl = this.gl;
    const program = this.program;
    gl.useProgram(program);
    const positionLocation = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, ITEM_SIZE, gl.FLOAT, false, 0, 0);
    const uColor = gl.getUniformLocation(program, 'uColor');
    gl.uniform4fv(uColor, this.colorVector);
    gl.drawArrays(this.type, 0, this.vertices.length);
  }

  _flattenVertices(vertices: NativePosition[]) {
    const flattenedVertices = [];
    for (let i = 0; i < vertices.length; i++) {
      flattenedVertices.push(vertices[i].x);
      flattenedVertices.push(vertices[i].y);
    }

    return flattenedVertices;
  }

  calculateAnchorPoint(): Vec2 {
    const n = this.vertices.length;
    let sigmaX = 0;
    let sigmaY = 0;
    for (let i = 0; i < n; i += 1) {
      sigmaX += this.vertices[i].x;
      sigmaY += this.vertices[i].y;
    }

    return [sigmaX / n, sigmaY / n];
  }
}

export { Drawable };
