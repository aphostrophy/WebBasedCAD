import FragmentShaderSource from './shaders/FragmentShader.glsl';
import VertexShaderSource from './shaders/VertexShader.glsl';
import { glUtils } from './libs/glUtils';
import { createSquare } from './libs/math';

const main = () => {
  const canvas = document.querySelector('canvas');
  if (!canvas) {
    throw new Error('Canvas not found!');
  }
  const gl = glUtils.checkWebGL(canvas);

  const aspect = canvas.width / canvas.height;

  // prettier-ignore
  // const vertices = new Float32Array([
  //   -0.25 ,0.25 * aspect, 0.25, 0.25 * aspect, 0.25, -0.25 * aspect,
  //   -0.25, 0.25 * aspect, 0.25, -0.25 * aspect, -0.25, -0.25 * aspect,
  // ]);

  const coordinates = createSquare(100, 100, 300);
  const vertices = new Float32Array(coordinates);

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  const itemSize = 2;
  const numItems = vertices.length / itemSize;

  const vertexShader = glUtils.getShader(gl, gl.VERTEX_SHADER, VertexShaderSource);
  const fragmentShader = glUtils.getShader(gl, gl.FRAGMENT_SHADER, FragmentShaderSource);

  const program = glUtils.createProgram(gl, vertexShader, fragmentShader);

  const positionLocation = gl.getAttribLocation(program, 'position');
  gl.enableVertexAttribArray(positionLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.vertexAttribPointer(positionLocation, itemSize, gl.FLOAT, false, 0, 0);

  gl.useProgram(program);

  let uColor = gl.getUniformLocation(program, 'uColor');
  gl.uniform4fv(uColor, [0.0, 0.3, 0.0, 1.0]);

  gl.drawArrays(gl.TRIANGLES, 0, numItems);
};

export default main;
