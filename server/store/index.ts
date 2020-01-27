import {
  createStore,
  combineReducers,
  Store as ReduxStore,
  Action,
} from 'redux';
import { generalReducer } from './general/reducers';
import { GeneralState } from './general/types';
import { SelectorFunction } from './general/selectors';

const rootReducer = combineReducers({
  general: generalReducer,
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
