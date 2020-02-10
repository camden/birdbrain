import { ResistancePlayer } from './types';

export const RST_PICK_MISSION_TEAM = 'RST_PICK_MISSION_TEAM';

export interface RstPickMissionTeamAction {
  type: typeof RST_PICK_MISSION_TEAM;
  payload: {
    teamMembers: ResistancePlayer[];
  };
}

export const rstPickMissionTeam = (teamMembers: ResistancePlayer[]) => {
  return {
    type: RST_PICK_MISSION_TEAM,
    payload: {
      teamMembers,
    },
  };
};

export type ResistanceActionTypes = RstPickMissionTeamAction;
