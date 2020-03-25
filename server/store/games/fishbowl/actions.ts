import { ActionMeta } from 'store/general/types';
import { Timestamp, FishbowlAnswer, FishbowlPhase } from './types';

export const FSH_START_ROUND = 'FSH_START_ROUND';
export const FSH_REPORT_END_ROUND = 'FSH_REPORT_END_ROUND';
export const FSH_GOT_ANSWER = 'FSH_GOT_ANSWER';
export const FSH_SKIP_ANSWER = 'FSH_SKIP_ANSWER';
export const FSH_ACK_RESULTS = 'FSH_ACK_RESULTS';

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

export interface FshGotAnswerAction extends FshBaseAction {
  type: typeof FSH_GOT_ANSWER;
}

export const fshGotAnswer = () => {
  return {
    type: FSH_GOT_ANSWER,
  };
};

export interface FshSkipAnswerAction extends FshBaseAction {
  type: typeof FSH_SKIP_ANSWER;
}

export const fshSkipAnswer = () => {
  return {
    type: FSH_SKIP_ANSWER,
  };
};

export interface FshAckResultsAction extends FshBaseAction {
  type: typeof FSH_ACK_RESULTS;
}

export const fshAckResults = () => {
  return {
    type: FSH_ACK_RESULTS,
  };
};

export type FishbowlActionTypes =
  | FshStartRoundAction
  | FshReportEndOfRoundAction
  | FshGotAnswerAction
  | FshSkipAnswerAction
  | FshAckResultsAction;
