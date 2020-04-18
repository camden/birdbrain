import { UserID, ActionMeta } from 'store/general/types';
import uuid from 'uuid/v4';

export interface LudumBaseAction {
  meta: ActionMeta;
}

export const LD_ACK_INTRO = 'LD_ACK_INTRO';

export interface LudumAckIntroAction extends LudumBaseAction {
  type: typeof LD_ACK_INTRO;
}

export const ludumAckIntro = () => {
  return {
    type: LD_ACK_INTRO,
  };
};

export type LudumActionTypes = LudumAckIntroAction;
