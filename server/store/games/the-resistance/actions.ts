import {
  ResistancePlayer,
  ResistanceTeamVote,
  ResistanceMissionVote,
} from './types';
import { UserID, BaseAction } from 'store/general/types';

/**
 * actions needed:
 * - pick mission team
 * - cast mission team votes
 * - acknowledge mission team voting results
 * - cast mission outcome votes
 * - acknowledge mission final votes
 */

export const RST_PICK_MISSION_TEAM = 'RST_PICK_MISSION_TEAM';
export const RST_CAST_TEAM_VOTE = 'RST_CAST_TEAM_VOTE';
export const RST_ACK_TEAM_VOTE_RESULTS = 'RST_ACK_TEAM_VOTE_RESULTS';
export const RST_CAST_MISSION_VOTE = 'RST_CAST_MISSION_VOTE';
export const RST_ACK_MISSION_VOTE_RESULTS = 'RST_ACK_MISSION_VOTE_RESULTS';

export interface RstPickMissionTeamAction extends BaseAction {
  type: typeof RST_PICK_MISSION_TEAM;
  payload: {
    teamMembers: UserID[];
  };
}

export const rstPickMissionTeam = (teamMembers: UserID[]) => {
  return {
    type: RST_PICK_MISSION_TEAM,
    payload: {
      teamMembers,
    },
  };
};

export interface RstCastTeamVoteAction extends BaseAction {
  type: typeof RST_CAST_TEAM_VOTE;
  payload: {
    vote: ResistanceTeamVote;
  };
}

export const rstCastTeamVote = (vote: ResistanceTeamVote) => {
  return {
    type: RST_CAST_TEAM_VOTE,
    payload: {
      vote,
    },
  };
};

export interface RstAckTeamVoteResultsAction extends BaseAction {
  type: typeof RST_ACK_TEAM_VOTE_RESULTS;
}

export const rstAckTeamVoteResults = () => {
  return {
    type: RST_ACK_TEAM_VOTE_RESULTS,
  };
};

export interface RstCastMissionVoteAction extends BaseAction {
  type: typeof RST_CAST_MISSION_VOTE;
  payload: {
    vote: ResistanceMissionVote;
  };
}

export const rstCastMissionVote = (vote: ResistanceMissionVote) => {
  return {
    type: RST_CAST_MISSION_VOTE,
    payload: {
      vote,
    },
  };
};

export interface RstAckMissionVoteResultsAction extends BaseAction {
  type: typeof RST_ACK_MISSION_VOTE_RESULTS;
}

export const rstAckMissionVoteResults = () => {
  return {
    type: RST_ACK_MISSION_VOTE_RESULTS,
  };
};

export type ResistanceActionTypes =
  | RstPickMissionTeamAction
  | RstCastTeamVoteAction
  | RstAckTeamVoteResultsAction
  | RstCastMissionVoteAction
  | RstAckMissionVoteResultsAction;
