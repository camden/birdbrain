import { UserID, ActionMeta } from 'store/general/types';
import uuid from 'uuid/v4';

export interface PongBaseAction {
  meta: ActionMeta;
}

export const PONG_UPDATE_POSITION = 'PONG_UPDATE_POSITION';

export interface PongUpdatePositionAction extends PongBaseAction {
  type: typeof PONG_UPDATE_POSITION;
  payload: {
    x: number;
    y: number;
  };
}

export const pongUpdatePosition = (x: number, y: number) => {
  return {
    type: PONG_UPDATE_POSITION,
    payload: {
      x,
      y,
    },
  };
};

export type PongActionTypes = PongUpdatePositionAction;
