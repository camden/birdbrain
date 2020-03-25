import { FishbowlGameState, FishbowlPhase } from './types';
import {
  FishbowlActionTypes,
  FSH_START_ROUND,
  FSH_REPORT_END_ROUND,
} from './actions';
import produce from 'immer';
import { ROUND_DURATION_MS } from '.';

export const fishbowlReducer = (
  game: FishbowlGameState,
  action: FishbowlActionTypes
): FishbowlGameState => {
  switch (action.type) {
    case FSH_START_ROUND: {
      const isCorrectRound = game.phase === FishbowlPhase.PRE_ROUND;
      const isFromActivePlayer =
        action.meta.userId === game.activePlayer.userId;

      if (!isCorrectRound || !isFromActivePlayer) {
        return game;
      }

      return produce(game, draftState => {
        draftState.roundEndTime = action.payload.startTime + ROUND_DURATION_MS;
        draftState.phase = FishbowlPhase.GUESSING;
      });
    }
    case FSH_REPORT_END_ROUND: {
      return produce(game, draftState => {
        draftState.roundEndTime = null;
        draftState.phase = FishbowlPhase.RESULTS;
      });
    }
  }
};
