import { UserID, ActionMeta } from 'store/general/types';
import uuid from 'uuid/v4';

export interface LudumBaseAction {
  meta: ActionMeta;
}

export const LD_ACK = 'LD_ACK';

export interface LudumAckAction extends LudumBaseAction {
  type: typeof LD_ACK;
}

export const ludumAck = () => {
  return {
    type: LD_ACK,
  };
};

export type LudumActionTypes = LudumAckAction;
