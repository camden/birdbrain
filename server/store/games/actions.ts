import { SET_CURRENT_GAME, SetCurrentGameAction, GameID } from './types';

export const setCurrentGame = (game: GameID): SetCurrentGameAction => {
  return {
    type: SET_CURRENT_GAME,
    payload: {
      game,
    },
  };
};
