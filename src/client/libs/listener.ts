import AppState from '../entity/AppState';
import { calculateClientMousePosition, calculateRealMousePosition } from '../libs/math';
import { resizer } from '../libs/resizer';
import { Position } from '../typings';

const setupListeners = (appState: AppState) => {
  const domHandler = appState.getDOMHandler();

  domHandler.window.addEventListener('resize', () =>
    resizer(domHandler.canvas, domHandler.getGl())
  );

  domHandler.window.addEventListener('keydown', (ev: KeyboardEvent) =>
    handleKeyboardPress(ev, appState)
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

const handleCanvasClickEvent = (e: MouseEvent, appState: AppState): void => {
  const mode = appState.getAppStateMode();
  const realPos = calculateRealMousePosition(e);

  if (mode === 'DRAWING') {
    console.log('ADD', realPos);
    appState.addVertex(realPos);
  }
};

const handleKeyboardPress = (ev: KeyboardEvent, appState: AppState): void => {
  const mode = appState.getAppStateMode();
  if (ev.key === 'q') {
    if (mode !== 'IDLE') {
      appState.setIdle();
    } else {
      appState.setDrawing();
    }
  }

  if (ev.key === 'Enter') {
    appState.submitDrawing();
  }
};

export { setupListeners };
