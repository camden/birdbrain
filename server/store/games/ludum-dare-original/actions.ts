import { UserID, ActionMeta, Timestamp } from 'store/general/types';
import uuid from 'uuid/v4';
import { LudumOriginalMinigameAnswer, LudumOriginalMinigame } from './types';

export interface LudumOriginalBaseAction {
  meta: ActionMeta;
}

export const LD_ORIGINAL_ACK = 'LD_ORIGINAL_ACK';
export const LD_ORIGINAL_START_MINIGAME = 'LD_ORIGINAL_START_MINIGAME';
export const LD_ORIGINAL_REPORT_END_MINIGAME =
  'LD_ORIGINAL_REPORT_END_MINIGAME';
export const LD_ORIGINAL_CHECK_MINIGAME_ANSWER =
  'LD_ORIGINAL_CHECK_MINIGAME_ANSWER';

export interface LudumOriginalAckAction extends LudumOriginalBaseAction {
  type: typeof LD_ORIGINAL_ACK;
}

export const ludumOriginalAck = () => {
  return {
    type: LD_ORIGINAL_ACK,
  };
};

export interface LudumOriginalStartMinigameAction
  extends LudumOriginalBaseAction {
  type: typeof LD_ORIGINAL_START_MINIGAME;
  payload: {
    startTime: Timestamp;
  };
}

export const ludumOriginalStartMinigame = (startTime: Timestamp) => {
  return {
    type: LD_ORIGINAL_START_MINIGAME,
    payload: {
      startTime,
    },
  };
};

export interface LudumOriginalReportEndMinigameAction
  extends LudumOriginalBaseAction {
  type: typeof LD_ORIGINAL_REPORT_END_MINIGAME;
}

export const ludumOriginalReportEndMinigame = () => {
  return {
    type: LD_ORIGINAL_REPORT_END_MINIGAME,
  };
};

export interface LudumOriginalCheckMinigameAnswerAction
  extends LudumOriginalBaseAction {
  type: typeof LD_ORIGINAL_CHECK_MINIGAME_ANSWER;
  payload: {
    answer: LudumOriginalMinigameAnswer;
  };
}

export const ludumOriginalCheckMinigameAnswer = (
  answer: LudumOriginalMinigameAnswer
) => {
  return {
    type: LD_ORIGINAL_CHECK_MINIGAME_ANSWER,
    payload: {
      answer,
    },
  };
};

export type LudumOriginalActionTypes =
  | LudumOriginalCheckMinigameAnswerAction
  | LudumOriginalAckAction
  | LudumOriginalStartMinigameAction
  | LudumOriginalReportEndMinigameAction;
