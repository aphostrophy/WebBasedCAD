import { Drawable } from './entities';
import { glUtils } from '../libs/glUtils';
import { setupListeners } from '../libs/listener';
import { AppStateMode, DrawableType, Position } from '../typings';

const canvas = document.querySelector('canvas');
if (!canvas) {
  throw new Error('Canvas not found!');
}
const gl = glUtils.checkWebGL(canvas);

class AppState {
  private mode: AppStateMode = 'IDLE';
  private shape: DrawableType = 'RECTANGLE';
  private gl: WebGLRenderingContext = gl;
  private drawables: Drawable[];

  constructor() {
    this.drawables = [];

    setupListeners(this);
  }

  public run(main: () => void) {
    main();
  }

  public setDrawing(shape: DrawableType) {
    this.mode = 'DRAWING';
    this.shape = shape;
  }
}

export default AppState;
