import { LudumGameState, LudumPlayer, LudumPhase } from './types';
import { LudumActionTypes, LD_ACK } from './actions';
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
    case LD_ACK:
      return produce(game, (draftState) => {
        const player = getPlayer(draftState, action);

        if (game.acknowledged.includes(player.userId)) {
          return;
        }

        draftState.acknowledged.push(player.userId);

        const everyoneAcked = game.players.every((p) =>
          draftState.acknowledged.includes(p.userId)
        );

        if (everyoneAcked) {
          if (game.phase === LudumPhase.INTRO) {
            draftState.phase = LudumPhase.PRE_MINIGAME;
            draftState.acknowledged = [];
            return;
          }

          if (game.phase === LudumPhase.PRE_MINIGAME) {
            draftState.phase = LudumPhase.PLAY_MINIGAME;
            draftState.acknowledged = [];
            return;
          }
        }
      });
  }
};

export default ludumReducer;
