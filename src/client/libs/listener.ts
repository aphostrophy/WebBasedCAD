import AppState from '../entity/AppState';
import { calculateClientMousePosition, calculateRealMousePosition } from '../libs/math';
import { resizer } from '../libs/resizer';
import { DrawableType, Position } from '../typings';

const indexToShape: DrawableType[] = ['LINE', 'SQUARE', 'RECTANGLE', 'POLYGON'];

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

  domHandler.menuPicker.addEventListener('change', (ev: Event) =>
    handleSelectShapeOptionChange(ev, appState)
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

  if (ev.key === 'r') {
    appState.resetCanvas();
  }

  if (ev.key === 'Enter') {
    appState.submitDrawing();
  }
};

const handleSelectShapeOptionChange = (ev: Event, appState: AppState) => {
  const target = ev.target;
  if (target instanceof HTMLSelectElement) {
    appState.setDrawShape(indexToShape[target.selectedIndex]);
  }
};

export { setupListeners };
