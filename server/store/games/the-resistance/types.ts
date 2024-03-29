import { GameType, Game } from '../types';
import { UserID } from 'store/general/types';

export enum ResistancePhase {
  PICK_TEAM = 'PICK_TEAM',
  VOTE_FOR_TEAM = 'VOTE_FOR_TEAM',
  SHOW_TEAM_VOTING_RESULTS = 'SHOW_TEAM_VOTING_RESULTS',
  CONDUCT_MISSION = 'CONDUCT_MISSION',
  SHOW_MISSION_RESULTS = 'SHOW_MISSION_RESULTS',
  SHOW_FINAL_RESULTS = 'SHOW_FINAL_RESULTS',
}

export interface ResistanceGameState extends Game {
  type: GameType.THE_RESISTANCE;
  missionLeader: ResistancePlayer;
  phase: ResistancePhase;
  mission: 1 | 2 | 3 | 4 | 5;
  missionTeam: UserID[];
  teamApprovalVotes: UserID[];
  teamRejectVotes: UserID[];
  missionSuccessVotes: UserID[];
  missionFailVotes: UserID[];
  acknowledged: UserID[];
  players: ResistancePlayer[];
  allMissions: [
    ResistanceMission,
    ResistanceMission,
    ResistanceMission,
    ResistanceMission,
    ResistanceMission
  ];
}

export interface ResistanceMission {
  number: number;
  status: ResistanceMissionStatus;
  requiredPlayers: number;
  requiresTwoFails: boolean;
}

export enum ResistanceMissionStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED',
  NOT_STARTED = 'NOT_STARTED',
}

export enum ResistanceRole {
  Resistance = 'Resistance',
  Spy = 'Spy',
}

export interface ResistancePlayer {
  role: ResistanceRole;
  name: string;
  userId: UserID;
}

export enum ResistanceTeamVote {
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
}

export enum ResistanceMissionVote {
  SUCCESS = 'SUCCESS',
  FAIL = 'FAIL',
}
