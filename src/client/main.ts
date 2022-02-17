import FragmentShaderSource from './shaders/FragmentShader.glsl';
import VertexShaderSource from './shaders/VertexShader.glsl';
import { glUtils } from './libs/glUtils';
import { generateSquareVertices, generateRectangleVertices } from './libs/math';

const main = () => {
  const canvas = document.querySelector('canvas');
  if (!canvas) {
    throw new Error('Canvas not found!');
  }
  const gl = glUtils.checkWebGL(canvas);

  const coordinates = generateSquareVertices({ x: 100, y: 100 }, 100);
  // const coordinates = generateRectangleVertices({ x: 100, y: 200 }, { x: 300, y: 800 });
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
