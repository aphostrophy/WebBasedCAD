import { glUtils } from '../libs/glUtils';
import { AppStateMode, DrawableType, Position } from '../typings';

const canvas = document.querySelector('canvas') as HTMLCanvasElement;

const clientX = document.querySelector('.mouse-pos-x') as HTMLSpanElement;
const clientY = document.querySelector('.mouse-pos-y') as HTMLSpanElement;

const appStateMode = document.querySelector('.app-state-mode') as HTMLSpanElement;

const drawShape = document.querySelector('.draw-shape') as HTMLSpanElement;

const menuPicker = document.querySelector('#menushape') as HTMLSelectElement;

class DOMHandler {
  public window: Window & typeof globalThis;
  public document: Document;
  public canvas: HTMLCanvasElement;
  public clientX: HTMLSpanElement;
  public clientY: HTMLSpanElement;
  public appStateMode: HTMLSpanElement;
  public menuPicker: HTMLSelectElement;
  public drawShape: HTMLSpanElement;

  constructor() {
    this.canvas = canvas;
    this.clientX = clientX;
    this.clientY = clientY;
    this.window = window;
    this.document = document;
    this.appStateMode = appStateMode;
    this.menuPicker = menuPicker;

    this.drawShape = drawShape;
  }

  public getGl() {
    return glUtils.checkWebGL(this.canvas);
  }

  public setMousePosition(pos: Position) {
    const { x, y }: Position = pos;
    this.clientX.innerHTML = x.toString();
    this.clientY.innerHTML = y.toString();
  }

  public setAppStateMode(mode: AppStateMode) {
    this.appStateMode.innerHTML = mode;
  }

  public setDrawShape(shape: DrawableType) {
    this.drawShape.innerHTML = shape;
  }
}

export default DOMHandler;
