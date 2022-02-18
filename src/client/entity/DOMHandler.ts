import { glUtils } from '../libs/glUtils';
import { Position } from '../typings';

const clientX = document.querySelector('.mouse-pos-x') as HTMLSpanElement;
const clientY = document.querySelector('.mouse-pos-y') as HTMLSpanElement;

const canvas = document.querySelector('canvas') as HTMLCanvasElement;

class DOMHandler {
  public window: Window & typeof globalThis;
  public canvas: HTMLCanvasElement;
  public clientX: HTMLSpanElement;
  public clientY: HTMLSpanElement;

  constructor() {
    this.canvas = canvas;
    this.clientX = clientX;
    this.clientY = clientY;
    this.window = window;
  }

  public getGl() {
    return glUtils.checkWebGL(this.canvas);
  }

  public setMousePosition(pos: Position) {
    const { x, y }: Position = pos;
    this.clientX.innerHTML = x.toString();
    this.clientY.innerHTML = y.toString();
  }
}

export default DOMHandler;
