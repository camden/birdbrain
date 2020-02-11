import { GameType, Game } from '../types';
import { UserID } from '../../general/types';

export enum ResistancePhase {
  PICK_TEAM = 'PICK_TEAM',
  VOTE_FOR_TEAM = 'VOTE_FOR_TEAM',
  SHOW_TEAM_VOTING_RESULTS = 'SHOW_TEAM_VOTING_RESULTS',
  CONDUCT_MISSION = 'CONDUCT_MISSION',
  SHOW_MISSION_RESULTS = 'SHOW_MISSION_RESULTS',
}

export interface ResistanceGameState extends Game {
  type: GameType.THE_RESISTANCE;
  missionLeader: ResistancePlayer;
  phase: ResistancePhase;
  mission: number;
  players: ResistancePlayer[];
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
