import AppState from '../entity/AppState';
import { calculateClientMousePosition, calculateRealMousePosition } from '../libs/math';
import { resizer } from '../libs/resizer';
import { DrawableType } from '../typings';

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

  domHandler.shapePicker.addEventListener('change', (ev: Event) =>
    handleSelectShapeOptionChange(ev, appState)
  );

  domHandler.colorPicker.addEventListener('change', (ev: Event) =>
    handleSelectColorOptionChange(ev, appState)
  );

  domHandler.loadFileButton.addEventListener('click', (ev: MouseEvent) =>
    handleLoadFile(ev, appState)
  );

  domHandler.saveFileButton.addEventListener('click', (ev: MouseEvent) =>
    handleSaveFile(ev, appState)
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
  if (mode == 'SELECTING') {
    if (appState.noSelectedShape()) {
      // If there is no selected shape
      const drawable = appState.selectShape(realPos);
      if (drawable) {
        appState.setColor(drawable.colorHex);
      }
    } else {
      // If there is a selected shape
      if (appState.isMovingVertice()) {
        appState.changeMovingVertice(-1);
      } else {
        const movingVerticeIndex = appState.positionOnVertice(realPos);
        if (movingVerticeIndex != -1) {
          appState.changeMovingVertice(movingVerticeIndex);
        } else {
          appState.selectShape(realPos);
        }
      }
    }
  }
};

const handleKeyboardPress = (ev: KeyboardEvent, appState: AppState): void => {
  const mode = appState.getAppStateMode();
  if (ev.key === 'q') {
    if (mode === 'IDLE') {
      appState.setDrawing();
    } else if (mode == 'DRAWING') {
      appState.setSelecting();
    } else {
      appState.setIdle();
    }
  }

  if (ev.key === 'r') {
    appState.resetCanvas();
  }

  if (ev.key === 'Enter') {
    appState.submitDrawing();
  }

  if (ev.key === 'Escape') {
    appState.clearPendingVertices();
  }
};

const handleSelectShapeOptionChange = (ev: Event, appState: AppState): void => {
  const target = ev.target;
  if (target instanceof HTMLSelectElement) {
    appState.setDrawShape(indexToShape[target.selectedIndex]);
  }
};

const handleSelectColorOptionChange = (ev: Event, appState: AppState): void => {
  const target = ev.target;
  if (target instanceof HTMLInputElement) {
    const colorHex = target.value;
    appState.setColor(colorHex);
  }
};

const handleLoadFile = (ev: MouseEvent, appState: AppState): void => {
  appState.load();
};

const handleSaveFile = (ev: MouseEvent, appState: AppState): void => {
  appState.save();
};

export { setupListeners };
