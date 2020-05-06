import { ActionMeta } from '@server/store/general/types';
import produce from 'immer';
import { ActionType, getType } from 'typesafe-actions';
import * as speedboatActions from './actions';
import { SpeedboatGameState, SpeedboatPlayer } from './types';

export type SpeedboatActionTypes = ActionType<typeof speedboatActions> & {
  meta: ActionMeta;
};

const getPlayer = (
  game: SpeedboatGameState,
  action: SpeedboatActionTypes
): SpeedboatPlayer => {
  const player = game.players.find((p) => p.userId === action.meta.userId);
  if (!player) {
    throw new Error('Expected to find player for id.');
  }

  return player;
};

const speedboatReducer = (
  game: SpeedboatGameState,
  action: SpeedboatActionTypes
): SpeedboatGameState => {
  switch (action.type) {
    case getType(speedboatActions.speedboatDummyAction):
      return produce(game, (draftState) => {
        const player = getPlayer(game, action);
        console.log('DUMMY ACTION', player);
      });
  }
};

export default speedboatReducer;
