import { ActionMeta } from 'store/general/types';
import { Timestamp } from './types';

export const FSH_START_ROUND = 'FSH_START_ROUND';

export interface FshBaseAction {
  meta: ActionMeta;
}

export interface FshStartRoundAction extends FshBaseAction {
  type: typeof FSH_START_ROUND;
  payload: {
    startTime: Timestamp;
  };
}

export const fshStartRound = (startTime: Timestamp) => {
  return {
    type: FSH_START_ROUND,
    payload: {
      startTime,
    },
  };
};

export type FishbowlActionTypes = FshStartRoundAction;
