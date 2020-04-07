import { ActionMeta } from '../../general/types';
import { MinidomCardType } from './types';

export const DOM_DRAW_CARD = 'DOM_DRAW_CARD';
export const DOM_PLAY_CARD_FROM_HAND = 'DOM_PLAY_CARD_FROM_HAND';

export interface DomBaseAction {
  meta: ActionMeta;
}

export interface DomDrawCardAction extends DomBaseAction {
  type: typeof DOM_DRAW_CARD;
}

export const domDrawCard = () => {
  return {
    type: DOM_DRAW_CARD,
  };
};

export interface DomPlayCardFromHandAction extends DomBaseAction {
  type: typeof DOM_PLAY_CARD_FROM_HAND;
  payload: {
    cardIndex: number;
  };
}

export const domPlayCardFromHand = (cardIndex: number) => {
  return {
    type: DOM_PLAY_CARD_FROM_HAND,
    payload: {
      cardIndex,
    },
  };
};

export type MinidomActionTypes = DomDrawCardAction | DomPlayCardFromHandAction;
