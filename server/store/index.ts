import {
  createStore,
  combineReducers,
  Store as ReduxStore,
  Action,
} from 'redux';
import { generalReducer } from './general/reducers';
import { SelectorFunction } from './general/selectors';
import { gameReducer } from './games/reducers';

const rootReducer = combineReducers({
  general: generalReducer,
  game: gameReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export class Store {
  private instance: ReduxStore;

  constructor() {
    this.instance = createStore(rootReducer);
  }

  public dispatch(action: Action) {
    return this.instance.dispatch(action);
  }

  public select(selector: SelectorFunction) {
    return selector(this.instance.getState());
  }
}
