import { ResistanceGameState } from './types';
import { ResistanceActionTypes, RST_PICK_MISSION_TEAM } from './actions';

export const resistanceReducer = (
  game: ResistanceGameState,
  action: ResistanceActionTypes
): ResistanceGameState => {
  switch (action.type) {
    case RST_PICK_MISSION_TEAM:
      console.log('picking team', action.payload.teamMembers);
      return game;
    default:
      return game;
  }
};
