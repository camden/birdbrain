import { ResistanceGameState, ResistancePhase } from './types';
import { ResistanceActionTypes, RST_PICK_MISSION_TEAM } from './actions';
import produce from 'immer';

export const resistanceReducer = (
  game: ResistanceGameState,
  action: ResistanceActionTypes
): ResistanceGameState => {
  switch (action.type) {
    case RST_PICK_MISSION_TEAM:
      return produce(game, draftState => {
        draftState.phase = ResistancePhase.VOTE_FOR_TEAM;
        draftState.missionTeam = action.payload.teamMembers;
      });
    default:
      return game;
  }
};
