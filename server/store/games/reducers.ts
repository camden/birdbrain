import { GameState, GameActionTypes, SET_CURRENT_GAME } from './types';

// TODO This structure is all wrong. we need to normalize the state tree
export const initialState: GameState = {
  currentGameID: null,
};

export const gameReducer = (state = initialState, action: GameActionTypes) => {
  switch (action.type) {
    case SET_CURRENT_GAME:
      return {
        ...state,
        currentGameID: action.payload.game,
      };
      break;
    default:
      return state;
  }
};
