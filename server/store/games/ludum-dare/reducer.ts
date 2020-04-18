import { LudumGameState, LudumPlayer } from './types';
import { LudumActionTypes, LD_ACK_INTRO } from './actions';
import produce from 'immer';

const getPlayer = (
  game: LudumGameState,
  action: LudumActionTypes
): LudumPlayer => {
  const player = game.players.find((p) => p.userId === action.meta.userId);
  if (!player) {
    throw new Error('Expected to find player for id.');
  }

  return player;
};

const ludumReducer = (
  game: LudumGameState,
  action: LudumActionTypes
): LudumGameState => {
  switch (action.type) {
    case LD_ACK_INTRO:
      return produce(game, (draftState) => {
        const player = getPlayer(draftState, action);

        if (game.acknowledged.includes(player.userId)) {
          return;
        }

        draftState.acknowledged.push(player.userId);
      });
  }
};

export default ludumReducer;
