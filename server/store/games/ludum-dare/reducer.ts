import { LudumGameState } from './types';
import { LudumActionTypes, LD_ACK_INTRO } from './actions';
import produce from 'immer';

const ludumReducer = (
  game: LudumGameState,
  action: LudumActionTypes
): LudumGameState => {
  switch (action.type) {
    case LD_ACK_INTRO:
      return produce(game, (draftState) => {
        //
      });
  }
};

export default ludumReducer;
