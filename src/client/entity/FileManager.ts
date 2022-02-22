import { DrawablePrimitives } from '../typings';
import AppState from './AppState';

class FileManager {
  constructor() {}

  public saveAppState(appState: AppState) {
    const data: DrawablePrimitives[] = appState.getDrawablesPrimitives();
    this.download(JSON.stringify(data), 'aphos-WEBCAD-state.json', 'application/json');
  }

  public loadAppState(appState: AppState) {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.style.display = 'none';

    fileInput.onchange = (ev: Event) => this.readFile(ev, appState);
    fileInput.click();
  }

  private download(data: string, fileName: string, contentType: string): void {
    const file = new Blob([data], { type: contentType });
    const a = document.createElement('a');
    const url = URL.createObjectURL(file);
    a.href = url;
    a.download = fileName;
    a.click();
    (async () => {
      window.URL.revokeObjectURL(url);
    })();
  }

  private readFile(ev: Event, appState: AppState): void {
    const target = ev.target;
    if (target instanceof HTMLInputElement && target.files) {
      const file = target.files[0];
      if (!file) {
        return;
      }
      const fileReader = new FileReader();
      fileReader.onload = (ev: ProgressEvent<FileReader>) => {
        if (ev.target instanceof FileReader) {
          const content = ev.target.result as string;
          const parsed = JSON.parse(content) as DrawablePrimitives[];
          appState.populateDrawables(parsed);
        }
      };
      fileReader.readAsText(file);
    }
  }
}

export default FileManager;
