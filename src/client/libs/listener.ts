import AppState from '../entity/AppState';
import { glUtils } from '../libs/glUtils';
import { calculateClientMousePosition } from '../libs/math';

let canvas = document.querySelector('canvas');
if (!canvas) {
  throw new Error('Canvas not found!');
}
const gl = glUtils.checkWebGL(canvas);

const posX = document.querySelector('.mouse-pos-x') as HTMLSpanElement;
const posY = document.querySelector('.mouse-pos-y') as HTMLSpanElement;

const setupListeners = (appState: AppState) => {
  canvas = canvas as HTMLCanvasElement;
  canvas.addEventListener('mousemove', trackCanvasMousePosition);
};

const trackCanvasMousePosition = (e: MouseEvent): void => {
  const { x, y } = calculateClientMousePosition(e);
  posX.innerHTML = x.toString();
  posY.innerHTML = y.toString();
};

const handleCanvasClickEvent = (e: MouseEvent, appState: AppState): void => {};

export { setupListeners, trackCanvasMousePosition };
