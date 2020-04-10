import {
  createStore,
  combineReducers,
  Store as ReduxStore,
  Action,
  applyMiddleware,
} from 'redux';
import { generalReducer } from './general/reducers';
import { SelectorFunction } from './general/selectors';
import serverSocketMiddleware from './middleware/server-socket-middleware';
import { enableAllPlugins } from 'immer';

enableAllPlugins();

const rootReducer = combineReducers({
  general: generalReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export class Store {
  private instance: ReduxStore;

  constructor(socketServer: SocketIO.Server) {
    this.instance = createStore(
      rootReducer,
      applyMiddleware(serverSocketMiddleware(socketServer))
    );
  }

  public dispatch(action: Action) {
    return this.instance.dispatch(action);
  }

  public select(selector: SelectorFunction) {
    return selector(this.instance.getState());
  }
}
