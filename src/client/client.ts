import FragmentShaderSource from './shaders/FragmentShader.glsl';
import VertexShaderSource from './shaders/VertexShader.glsl';

const canvas = document.querySelector('canvas');
const gl = window.glUtils.checkWebGL(canvas);

gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

const vertexData = [0, 1, 0, 1, -1, 0, -1, -1, 0];

const colorData = [1, 0, 0, 0, 1, 0, 0, 0, 1];

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

const colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);

const vertexShader: WebGLShader = gl.createShader(gl.VERTEX_SHADER) as WebGLShader;
if (!(vertexShader instanceof WebGLShader)) {
  throw new Error('Shader error');
}

gl.shaderSource(vertexShader, VertexShaderSource);
gl.compileShader(vertexShader);

const fragmentShader: WebGLShader = gl.createShader(gl.FRAGMENT_SHADER) as WebGLShader;
if (!(fragmentShader instanceof WebGLShader)) {
  throw new Error('Shader error');
}

gl.shaderSource(fragmentShader, FragmentShaderSource);
gl.compileShader(fragmentShader);

const program = gl.createProgram() as WebGLProgram;
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

const positionLocation = gl.getAttribLocation(program, 'position');
gl.enableVertexAttribArray(positionLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

const colorLocation = gl.getAttribLocation(program, 'color');
gl.enableVertexAttribArray(colorLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

gl.useProgram(program);
gl.drawArrays(gl.TRIANGLES, 0, 3);
