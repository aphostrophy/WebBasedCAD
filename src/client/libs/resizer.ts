import { glUtils } from './glUtils';

let canvas = document.querySelector('canvas');
if (!canvas) {
  throw new Error('Canvas not found!');
}

const gl = glUtils.checkWebGL(canvas);

const resizer = () => {
  (canvas as HTMLCanvasElement).width = window.innerWidth;
  (canvas as HTMLCanvasElement).height = window.innerHeight;
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
};

window.addEventListener('resize', resizer);

resizer();

gl.clearColor(1.0, 1.0, 1.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);
