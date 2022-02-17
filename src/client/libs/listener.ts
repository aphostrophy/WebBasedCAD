import AppState from '../entity/AppState';

let canvas = document.querySelector('canvas');
if (!canvas) {
  throw new Error('Canvas not found!');
}

const posX = document.querySelector('.mouse-pos-x') as HTMLSpanElement;
const posY = document.querySelector('.mouse-pos-y') as HTMLSpanElement;

const setupListeners = (appState: AppState) => {
  canvas = canvas as HTMLCanvasElement;
  canvas.addEventListener('mousemove', trackCanvasMousePosition);
};

const trackCanvasMousePosition = (e: MouseEvent): void => {
  canvas = canvas as HTMLCanvasElement;
  const bound = canvas.getBoundingClientRect();
  const x = e.pageX - Math.floor(bound.left);
  const y = e.pageY - Math.floor(bound.top);
  posX.innerHTML = x.toString();
  posY.innerHTML = y.toString();
};

export { setupListeners, trackCanvasMousePosition };
