import { Drawable } from './entities';
import { setupListeners } from '../libs/listener';

class AppState {
  private drawables: Drawable[];

  constructor() {
    this.drawables = [];

    setupListeners(this);
  }

  public run(main: () => void) {
    main();
  }
}

export default AppState;
