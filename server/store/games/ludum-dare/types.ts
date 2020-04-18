import { Game, GameType } from '../types';
import { UserID, Timestamp } from 'store/general/types';

export interface LudumGameState extends Game {
  type: GameType.LUDUM;
  players: LudumPlayer[];
  acknowledged: UserID[];
  phase: LudumPhase;
  minigameEndTime: Timestamp | null;
  currentMinigame: LudumMinigame | null;
  currentMinigameState: LudumMinigameState | null;
  playersWhoPassedCurrentMinigame: UserID[];
  roundNumber: number;
}

export type LudumMinigameState = LudumMinigameSimonSaysState;

export type LudumMinigameAnswer = LudumMinigameSimonSaysAnswer;

export type LudumMinigameSimonSaysAnswer = LudumShape[];

export enum LudumShape {
  CIRCLE = 'CIRCLE',
  HEART = 'HEART',
  TRIANGLE = 'TRIANGLE',
}

export interface LudumMinigameSimonSaysState {
  phrase: LudumShape[];
}

export enum LudumPhase {
  INTRO = 'INTRO',
  PRE_MINIGAME = 'PRE_MINIGAME',
  PLAY_MINIGAME = 'PLAY_MINIGAME',
  MINIGAME_RESULTS = 'MINIGAME_RESULTS',
  GAME_OVER = 'GAME_OVER',
}

export enum LudumMinigame {
  SIMON_SAYS = 'SIMON_SAYS',
}

export interface LudumPlayer {
  userId: UserID;
  name: string;
}
