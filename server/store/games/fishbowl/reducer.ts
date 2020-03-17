import { FishbowlGameState } from './types';
import { FishbowlActionTypes, FSH_START_ROUND } from './actions';
import produce from 'immer';

export const fishbowlReducer = (
  game: FishbowlGameState,
  action: FishbowlActionTypes
): FishbowlGameState => {
  switch (action.type) {
    case FSH_START_ROUND:
      return produce(game, draftState => {
        draftState.roundStartTime = action.payload.startTime;
      });
  }
};
