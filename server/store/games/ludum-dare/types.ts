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

export interface LudumCharacter {
  id: string;
  name: string;
  color: string;
}

export enum LudumPhase {
  INTRO = 'INTRO',
  PRE_MINIGAME = 'PRE_MINIGAME',
  PLAY_MINIGAME = 'PLAY_MINIGAME',
  MINIGAME_RESULTS = 'MINIGAME_RESULTS',
  GAME_OVER = 'GAME_OVER',
}

export interface LudumPlayer {
  userId: UserID;
  name: string;
  character: LudumCharacter;
  health: number;
}

/**
 * Minigames
 */

export enum LudumMinigame {
  SIMON_SAYS = 'SIMON_SAYS',
  HYDRAULICS = 'HYDRAULICS',
  REFLEXES = 'REFLEXES',
  DROPZONE = 'DROPZONE',
}

export type LudumMinigameState =
  | LudumMinigameSimonSaysState
  | LudumMinigameHydraulicsState
  | LudumMinigameReflexesState;

export type LudumMinigameAnswer =
  | LudumMinigameSimonSaysAnswer
  | LudumMinigameHydraulicsResult;

export type LudumMinigameSimonSaysAnswer = LudumHydraulicsShape[];

export enum LudumHydraulicsShape {
  CIRCLE = 'CIRCLE',
  SQUARE = 'SQUARE',
  STAR = 'STAR',
  TRIANGLE = 'TRIANGLE',
  DIAMOND = 'DIAMOND',
}

export interface LudumMinigameSimonSaysState {
  phrase: LudumHydraulicsShape[];
  timeBetweenShapes: number;
}

export type LudumMinigameHydraulicsButton = [
  number,
  LudumMinigameHydraulicsButtonPosition
];

export type LudumMinigameHydraulicsButtonPosition = boolean[];
export type LudumMinigameHydraulicsResult = number[];

export interface LudumMinigameHydraulicsState {
  pipeMaxLevel: number;
  correctResult: LudumMinigameHydraulicsResult;
  startingResult: LudumMinigameHydraulicsResult;
  buttons: LudumMinigameHydraulicsButton[];
}

export interface LudumMinigameReflexesState {}
