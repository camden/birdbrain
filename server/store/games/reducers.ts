import { GameState, GameActionTypes } from './types';

export const initialState: GameState = {
  currentGameID: null,
};

export const gameReducer = (state = initialState, action: GameActionTypes) => {
  return state;
};
