import { glUtils } from '../libs/glUtils';
import { AppStateMode, DrawableType, Position, Vec4 } from '../typings';

const canvas = document.querySelector('canvas') as HTMLCanvasElement;

const clientX = document.querySelector('.mouse-pos-x') as HTMLSpanElement;
const clientY = document.querySelector('.mouse-pos-y') as HTMLSpanElement;

const appStateMode = document.querySelector('.app-state-mode') as HTMLSpanElement;

const drawShape = document.querySelector('.draw-shape') as HTMLSpanElement;

const shapePicker = document.querySelector('#menushape') as HTMLSelectElement;

const colorPicker = document.querySelector('#shape-color') as HTMLInputElement;

class DOMHandler {
  public window: Window & typeof globalThis;
  public document: Document;
  public canvas: HTMLCanvasElement;
  public clientX: HTMLSpanElement;
  public clientY: HTMLSpanElement;
  public appStateMode: HTMLSpanElement;
  public shapePicker: HTMLSelectElement;
  public colorPicker: HTMLInputElement;
  public drawShape: HTMLSpanElement;

  constructor() {
    this.canvas = canvas;
    this.clientX = clientX;
    this.clientY = clientY;
    this.window = window;
    this.document = document;
    this.appStateMode = appStateMode;
    this.shapePicker = shapePicker;
    this.colorPicker = colorPicker;

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

  public setColor(color: string) {
    this.colorPicker.value = color;
  }
}

export default DOMHandler;
