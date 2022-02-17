import FragmentShaderSource from './shaders/FragmentShader.glsl';
import VertexShaderSource from './shaders/VertexShader.glsl';
import { glUtils } from './libs/glUtils';
import { createSquare, generateRectangleVertices } from './libs/math';
import { Drawable } from './entity/entities';

const main = () => {
  const canvas = document.querySelector('canvas');
  if (!canvas) {
    throw new Error('Canvas not found!');
  }
  const gl = glUtils.checkWebGL(canvas);

  const vertexShader = glUtils.getShader(gl, gl.VERTEX_SHADER, VertexShaderSource);
  const fragmentShader = glUtils.getShader(gl, gl.FRAGMENT_SHADER, FragmentShaderSource);

  const program = glUtils.createProgram(gl, vertexShader, fragmentShader);

  const coordinates = generateRectangleVertices({ x: 100, y: 200 }, { x: 300, y: 800 });
  const rectangle = new Drawable(gl, program, gl.TRIANGLES, [0.0, 0.3, 0.0, 1.0], coordinates);
  rectangle.draw();

  const coordinates2 = generateRectangleVertices({ x: 200, y: 100 }, { x: 800, y: 300 });
  const rectangle2 = new Drawable(gl, program, gl.TRIANGLES, [0.0, 0.3, 0.0, 1.0], coordinates2);
  rectangle2.draw();
};

export default main;
