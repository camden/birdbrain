import { ActionMeta } from 'store/general/types';
import { Timestamp } from './types';

export const FSH_START_ROUND = 'FSH_START_ROUND';
export const FSH_REPORT_END_ROUND = 'FSH_REPORT_END_ROUND';

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

export interface FshReportEndOfRoundAction extends FshBaseAction {
  type: typeof FSH_REPORT_END_ROUND;
}

export const fshReportEndOfRound = () => {
  return {
    type: FSH_REPORT_END_ROUND,
  };
};

export type FishbowlActionTypes =
  | FshStartRoundAction
  | FshReportEndOfRoundAction;
