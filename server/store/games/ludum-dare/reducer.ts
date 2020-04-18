import {
  LudumGameState,
  LudumPlayer,
  LudumPhase,
  LudumMinigame,
} from './types';
import {
  LudumActionTypes,
  LD_ACK,
  LD_START_MINIGAME,
  LD_REPORT_END_MINIGAME,
} from './actions';
import produce from 'immer';
import { MINIGAME_DURATION_MS } from '.';

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
            draftState.currentMinigame = LudumMinigame.SIMON_SAYS;
            draftState.acknowledged = [];
            draftState.roundNumber++;
            return;
          }

          if (game.phase === LudumPhase.MINIGAME_RESULTS) {
            draftState.phase = LudumPhase.PRE_MINIGAME;
            draftState.currentMinigame = LudumMinigame.SIMON_SAYS;
            draftState.acknowledged = [];
            draftState.roundNumber++;
            return;
          }
        }
      });
    case LD_START_MINIGAME:
      return produce(game, (draftState) => {
        if (game.phase !== LudumPhase.PRE_MINIGAME) {
          return;
        }

        const player = getPlayer(draftState, action);

        if (game.acknowledged.includes(player.userId)) {
          return;
        }

        draftState.acknowledged.push(player.userId);

        const everyoneAcked = game.players.every((p) =>
          draftState.acknowledged.includes(p.userId)
        );

        if (everyoneAcked) {
          draftState.phase = LudumPhase.PLAY_MINIGAME;
          draftState.acknowledged = [];
          draftState.minigameEndTime =
            action.payload.startTime + MINIGAME_DURATION_MS;
        }
      });
    case LD_REPORT_END_MINIGAME:
      return produce(game, (draftState) => {
        if (game.phase !== LudumPhase.PLAY_MINIGAME) {
          return;
        }

        draftState.minigameEndTime = null;
        draftState.currentMinigame = null;
        draftState.phase = LudumPhase.MINIGAME_RESULTS;
      });
  }
};

export default ludumReducer;
