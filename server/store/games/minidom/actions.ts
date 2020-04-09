import { ActionMeta } from '../../general/types';
import { MinidomCardType } from './types';

export const DOM_DRAW_CARD = 'DOM_DRAW_CARD';
export const DOM_PLAY_CARD_FROM_HAND = 'DOM_PLAY_CARD_FROM_HAND';
export const DOM_ACTIVATE_CARD = 'DOM_ACTIVATE_CARD';

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

export interface DomActivateCardAction extends DomBaseAction {
  type: typeof DOM_ACTIVATE_CARD;
  payload: {
    card: MinidomCardType;
  };
}

export const domActivateCard = (card: MinidomCardType) => {
  return {
    type: DOM_ACTIVATE_CARD,
    payload: {
      card,
    },
  };
};

export type MinidomActionTypes =
  | DomDrawCardAction
  | DomPlayCardFromHandAction
  | DomActivateCardAction;
