import { ActionMeta } from '../../general/types';

export const DOM_DRAW_CARD = 'DOM_DRAW_CARD';

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

export type MinidomActionTypes = DomDrawCardAction;
