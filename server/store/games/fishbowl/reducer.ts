import { FishbowlGameState, FishbowlPhase } from './types';
import { FishbowlActionTypes, FSH_START_ROUND } from './actions';
import produce from 'immer';

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
        draftState.roundStartTime = action.payload.startTime;
        draftState.phase = FishbowlPhase.GUESSING;
      });
    }
  }
};
