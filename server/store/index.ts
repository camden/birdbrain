import { createStore, combineReducers, Store } from 'redux';
import { generalReducer } from './general/reducers';
import { GeneralState } from './general/types';

const rootReducer = combineReducers({
  general: generalReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export const initializeStore = (): Store => {
  return createStore(rootReducer);
};
