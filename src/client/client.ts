import FragmentShaderSource from './shaders/FragmentShader.glsl';
import VertexShaderSource from './shaders/VertexShader.glsl';
import { glUtils } from './libs/glUtils';

const canvas = document.querySelector('canvas');
const gl = glUtils.checkWebGL(canvas);

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

const vertexShader = glUtils.getShader(gl, gl.VERTEX_SHADER, VertexShaderSource);
const fragmentShader = glUtils.getShader(gl, gl.FRAGMENT_SHADER, FragmentShaderSource);

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
