import { ActionMeta } from 'store/general/types';
import produce from 'immer';
import { ActionType, getType } from 'typesafe-actions';
import * as scoreCounterActions from './actions';
import { ScoreCounterGameState, ScoreCounterPlayer } from './types';

export type ScoreCounterActionTypes = ActionType<typeof scoreCounterActions> & {
  meta: ActionMeta;
};

const getPlayer = (
  game: ScoreCounterGameState,
  action: ScoreCounterActionTypes
): ScoreCounterPlayer => {
  const player = game.players.find((p) => p.userId === action.meta.userId);
  if (!player) {
    throw new Error('Expected to find player for id.');
  }

  return player;
};

const scoreCounterReducer = (
  game: ScoreCounterGameState,
  action: ScoreCounterActionTypes
): ScoreCounterGameState => {
  switch (action.type) {
    case getType(scoreCounterActions.scoreCounterAddAction):
      return produce(game, (draftState) => {
        const player = getPlayer(draftState, action);
        player.currentCount += action.payload;
      });
    case getType(scoreCounterActions.scoreCounterSetAction):
      return produce(game, (draftState) => {
        const player = getPlayer(draftState, action);
        player.currentCount = action.payload;
      });
  }
};

export default scoreCounterReducer;
