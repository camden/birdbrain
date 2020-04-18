import { UserID, ActionMeta, Timestamp } from 'store/general/types';
import uuid from 'uuid/v4';

export interface LudumBaseAction {
  meta: ActionMeta;
}

export const LD_ACK = 'LD_ACK';
export const LD_START_MINIGAME = 'LD_START_MINIGAME';
export const LD_REPORT_END_MINIGAME = 'LD_REPORT_END_MINIGAME';

export interface LudumAckAction extends LudumBaseAction {
  type: typeof LD_ACK;
}

export const ludumAck = () => {
  return {
    type: LD_ACK,
  };
};

export interface LudumStartMinigameAction extends LudumBaseAction {
  type: typeof LD_START_MINIGAME;
  payload: {
    startTime: Timestamp;
  };
}

export const ludumStartMinigame = (startTime: Timestamp) => {
  return {
    type: LD_START_MINIGAME,
    payload: {
      startTime,
    },
  };
};

export interface LudumReportEndMinigameAction extends LudumBaseAction {
  type: typeof LD_REPORT_END_MINIGAME;
}

export const ludumReportEndMinigame = () => {
  return {
    type: LD_REPORT_END_MINIGAME,
  };
};

export type LudumActionTypes =
  | LudumAckAction
  | LudumStartMinigameAction
  | LudumReportEndMinigameAction;
