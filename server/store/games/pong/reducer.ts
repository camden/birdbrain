import { PongGameState, PongPlayer } from './types';
import { PongActionTypes, PONG_UPDATE_POSITION } from './actions';
import produce from 'immer';

const getPlayer = (
  game: PongGameState,
  action: PongActionTypes
): PongPlayer => {
  const player = game.players.find((p) => p.userId === action.meta.userId);
  if (!player) {
    throw new Error('Expected to find player for id.');
  }

  return player;
};

export const pongReducer = (
  game: PongGameState,
  action: PongActionTypes
): PongGameState => {
  switch (action.type) {
    case PONG_UPDATE_POSITION:
      return produce(game, (draftState) => {
        const player = getPlayer(draftState, action);
        const { x, y } = action.payload;
        player.position.x = x;
        player.position.y = y;
      });
  }
};
