import { PongGameState } from './types';
import { PongActionTypes, PONG_UPDATE_POSITION } from './actions';
import produce from 'immer';

export const pongReducer = (
  game: PongGameState,
  action: PongActionTypes
): PongGameState => {
  switch (action.type) {
    case PONG_UPDATE_POSITION:
      return produce(game, (draftState) => {
        //
      });
  }
};
