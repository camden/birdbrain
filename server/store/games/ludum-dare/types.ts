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
  minigamesPlayedSoFar: LudumMinigame[];
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

export enum LudumShape {
  CIRCLE = 'CIRCLE',
  SQUARE = 'SQUARE',
  STAR = 'STAR',
  TRIANGLE = 'TRIANGLE',
  DIAMOND = 'DIAMOND',
}

/**
 * =========
 * Minigames
 * =========
 */

export enum LudumMinigame {
  SIMON_SAYS = 'SIMON_SAYS',
  HYDRAULICS = 'HYDRAULICS',
  REFLEXES = 'REFLEXES',
  PIZZA = 'PIZZA',
}

export type LudumMinigameState =
  | LudumMinigameSimonSaysState
  | LudumMinigameHydraulicsState
  | LudumMinigameReflexesState
  | LudumMinigamePizzaState;

export type LudumMinigameAnswer =
  | LudumMinigameSimonSaysAnswer
  | LudumMinigameHydraulicsResult
  | LudumMinigamePizzaAnswer;

/**
 * Simon Says
 */

export type LudumMinigameSimonSaysAnswer = LudumShape[];

export interface LudumMinigameSimonSaysState {
  phrase: LudumShape[];
  timeBetweenShapes: number;
}

/**
 * Hydraulics
 */

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

/**
 * Reflexes
 */

export interface LudumMinigameReflexesState {}

/**
 * Pizza
 */

export enum LudumMinigamePizzaTopping {
  CIRCLE1 = 'CIRCLE1',
  CIRCLE2 = 'CIRCLE2',
  CIRCLE3 = 'CIRCLE3',
  CIRCLE4 = 'CIRCLE4',
  DIAMOND1 = 'DIAMOND1',
  DIAMOND2 = 'DIAMOND2',
  DIAMOND3 = 'DIAMOND3',
  DIAMOND4 = 'DIAMOND4',
  SQUARE1 = 'SQUARE1',
  SQUARE2 = 'SQUARE2',
  SQUARE3 = 'SQUARE3',
  SQUARE4 = 'SQUARE4',
  STAR1 = 'STAR1',
  STAR2 = 'STAR2',
  STAR3 = 'STAR3',
  STAR4 = 'STAR4',
  TEE1 = 'TEE1',
  TEE2 = 'TEE2',
  TEE3 = 'TEE3',
  TEE4 = 'TEE4',
  TRIANGLE1 = 'TRIANGLE1',
  TRIANGLE2 = 'TRIANGLE2',
  TRIANGLE3 = 'TRIANGLE3',
  TRIANGLE4 = 'TRIANGLE4',
}

export enum LudumMinigamePizzaEvaluation {
  LIKE = 'LIKE',
  DISLIKE = 'DISLIKE',
  SKIP = 'SKIP',
}

export interface LudumMinigamePizzaCustomer {
  likes: LudumMinigamePizzaTopping[];
  dislikes: LudumMinigamePizzaTopping[];
  pizza: LudumMinigamePizzaTopping[];
  randomPizzaRotation: number;
  customerEvaluation: LudumMinigamePizzaEvaluation;
}

export interface LudumMinigamePizzaState {
  customers: LudumMinigamePizzaCustomer[];
  targetScore: number;
}

export type LudumMinigamePizzaAnswer = number;
