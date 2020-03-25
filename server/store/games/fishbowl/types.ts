import { Game, GameType } from '../types';
import { UserID } from 'store/general/types';

export type Timestamp = number;

export interface FishbowlGameState extends Game {
  type: GameType.FISHBOWL;
  roundEndTime: Timestamp | null;
  players: FishbowlPlayer[];
  activePlayer: FishbowlPlayer;
  phase: FishbowlPhase;
  allAnswers: FishbowlAnswer[];
  currentAnswer: FishbowlAnswer | null;
  answersAlreadySeen: FishbowlAnswer[];
  answersGot: FishbowlAnswer[];
  answersSkipped: FishbowlAnswer[];
  acknowledged: UserID[];
}

export enum FishbowlPhase {
  PRE_ROUND = 'PRE_ROUND',
  GUESSING = 'GUESSING',
  RESULTS = 'RESULTS',
}

export enum FishbowlTeam {
  TEAM_A = 'TEAM_A',
  TEAM_B = 'TEAM_B',
}

export interface FishbowlPlayer {
  name: string;
  userId: UserID;
  team: FishbowlTeam;
}

export type FishbowlAnswer = string;
