import FragmentShaderSource from './shaders/FragmentShader.glsl';
import VertexShaderSource from './shaders/VertexShader.glsl';
import { glUtils } from './libs/glUtils';
import {
  generateSquareVertices,
  generateRectangleVertices,
  generateLineVertices,
} from './libs/math';

const draw = (
  gl: WebGLRenderingContext,
  vertices: Float32Array,
  positionLocation: number,
  type: string
) => {
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  var itemSize = 2;
  var numItems = vertices.length / itemSize;
  gl.vertexAttribPointer(positionLocation, itemSize, gl.FLOAT, false, 0, 0);
  if (type == 'triangles') {
    gl.drawArrays(gl.TRIANGLES, 0, numItems);
  } else if (type == 'lines') {
    gl.drawArrays(gl.LINES, 0, numItems);
  }
};

const main = () => {
  const canvas = document.querySelector('canvas');
  if (!canvas) {
    throw new Error('Canvas not found!');
  }
  const gl = glUtils.checkWebGL(canvas);

  // Initiate Shader
  const vertexShader = glUtils.getShader(gl, gl.VERTEX_SHADER, VertexShaderSource);
  const fragmentShader = glUtils.getShader(gl, gl.FRAGMENT_SHADER, FragmentShaderSource);
  const program = glUtils.createProgram(gl, vertexShader, fragmentShader);
  gl.useProgram(program);

  // Initiate Position
  const positionLocation = gl.getAttribLocation(program, 'position');
  gl.enableVertexAttribArray(positionLocation);
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Initiate Color
  let uColor = gl.getUniformLocation(program, 'uColor');
  gl.uniform4fv(uColor, [0.0, 0.3, 0.0, 1.0]);

  // Asigning Coordinates
  var squareCoordinates = generateSquareVertices({ x: 0, y: 0 }, 100);
  var squareVertices = squareCoordinates;
  var rectangleCoordinates = generateRectangleVertices({ x: 100, y: 200 }, { x: 300, y: 500 });
  var rectangleVertices = rectangleCoordinates;
  var lineCoordinates = generateLineVertices({ x: 500, y: 200 }, { x: 800, y: 300 });
  var lineVertices = lineCoordinates;

  // Drawing to Canvas
  draw(gl, squareVertices, positionLocation, 'triangles');
  draw(gl, rectangleVertices, positionLocation, 'triangles');
  draw(gl, lineVertices, positionLocation, 'lines');
};

export default main;
