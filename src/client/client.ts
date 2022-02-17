import './libs/resizer';
import './libs/listener';
import AppState from './entity/AppState';
import main from './main';

const appState = new AppState();

appState.run(main);
