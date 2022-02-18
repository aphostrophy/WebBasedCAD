import AppState from '../entity/AppState';
import { calculateClientMousePosition, calculateRealMousePosition } from '../libs/math';
import { resizer } from '../libs/resizer';
import { Position } from '../typings';

const setupListeners = (appState: AppState) => {
  const domHandler = appState.getDOMHandler();

  domHandler.window.addEventListener('resize', () =>
    resizer(domHandler.canvas, domHandler.getGl())
  );

  domHandler.canvas.addEventListener('mousemove', (ev: MouseEvent) =>
    trackCanvasMousePosition(ev, appState)
  );
  domHandler.canvas.addEventListener('click', (ev: MouseEvent) =>
    handleCanvasClickEvent(ev, appState)
  );
};

const trackCanvasMousePosition = (e: MouseEvent, appState: AppState): void => {
  const clientPosition = calculateClientMousePosition(e);
  const realPosition = calculateRealMousePosition(e);
  appState.setMousePosition(clientPosition, realPosition);
};

const handleCanvasClickEvent = (e: MouseEvent, appState: AppState): void => {};

export { setupListeners, trackCanvasMousePosition };
