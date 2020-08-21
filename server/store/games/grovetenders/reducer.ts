import { ActionMeta } from 'store/general/types';
import produce from 'immer';
import { ActionType, getType } from 'typesafe-actions';
import * as groveActions from './actions';
import { GroveGameState, GrovePlayer } from './types';

export type GroveActionTypes = ActionType<typeof groveActions> & {
  meta: ActionMeta;
};

const getPlayer = (
  game: GroveGameState,
  action: GroveActionTypes
): GrovePlayer => {
  const player = game.players.find((p) => p.userId === action.meta.userId);
  if (!player) {
    throw new Error('Expected to find player for id.');
  }

  return player;
};

const groveReducer = (
  game: GroveGameState,
  action: GroveActionTypes
): GroveGameState => {
  switch (action.type) {
    case getType(groveActions.groveDummyAction):
      return produce(game, (draftState) => {
        const player = getPlayer(draftState, action);
        console.log('DUMMY~');
      });
  }
};

export default groveReducer;
