import { ActionMeta } from '../../general/types';
import { MinidomCardType, MinidomCardDirection } from './types';

export const DOM_DRAW_CARD = 'DOM_DRAW_CARD';
export const DOM_PLAY_CARD_FROM_HAND = 'DOM_PLAY_CARD_FROM_HAND';
export const DOM_ACTIVATE_CARD = 'DOM_ACTIVATE_CARD';
export const DOM_MAKE_MOVE = 'DOM_MAKE_MOVE';
export const DOM_END_PHASE = 'DOM_END_PHASE';
export const DOM_BUY_CARD_FROM_SHOP = 'DOM_BUY_CARD_FROM_SHOP';

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

export interface DomMakeMoveAction extends DomBaseAction {
  type: typeof DOM_MAKE_MOVE;
  payload: {
    direction: MinidomCardDirection;
  };
}

export const domMakeMove = (direction: MinidomCardDirection) => {
  return {
    type: DOM_MAKE_MOVE,
    payload: {
      direction,
    },
  };
};

export interface DomEndPhaseAction extends DomBaseAction {
  type: typeof DOM_END_PHASE;
}

export const domEndPhase = () => {
  return {
    type: DOM_END_PHASE,
  };
};

export type MinidomActionTypes =
  | DomEndPhaseAction
  | DomMakeMoveAction
  | DomDrawCardAction
  | DomPlayCardFromHandAction
  | DomActivateCardAction;
