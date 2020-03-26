import { Game, GameType } from '../types';
import { UserID } from 'store/general/types';

export type Timestamp = number;

export interface FishbowlGameState extends Game {
  type: GameType.FISHBOWL;
  roundEndTime: Timestamp | null;
  players: FishbowlPlayer[];
  lastActivePlayer: FishbowlPlayer | null;
  activePlayer: FishbowlPlayer;
  phase: FishbowlPhase;
  currentGameType: FishbowlGameType;
  allAnswers: FishbowlAnswer[];
  answersForCurrentGameType: FishbowlAnswer[];
  indexOfCurrentAnswer: number;
  answersGot: FishbowlAnswer[];
  answersSkipped: FishbowlAnswer[];
  acknowledged: UserID[];
  score: {
    [key in FishbowlTeam]: number;
  };
}

export enum FishbowlPhase {
  PRE_ROUND = 'PRE_ROUND',
  GUESSING = 'GUESSING',
  RESULTS = 'RESULTS',
  END_GAME_RESULTS = 'END_GAME_RESULTS',
}

export enum FishbowlGameType {
  TABOO = 'TABOO',
  CHARADES = 'CHARADES',
  PASSWORD = 'PASSWORD',
}

export enum FishbowlTeam {
  TEAM_A = 'TEAM_A',
  TEAM_B = 'TEAM_B',
}

export interface FishbowlPlayer {
  name: string;
  userId: UserID;
  team: FishbowlTeam;
  teamDisplayName: string;
}

export type FishbowlAnswer = string;
