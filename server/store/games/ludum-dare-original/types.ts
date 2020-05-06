import { Game, GameType } from '../types';
import { UserID, Timestamp } from 'store/general/types';

export interface LudumOriginalGameState extends Game {
  type: GameType.LUDUM_ORIGINAL;
  players: LudumOriginalPlayer[];
  acknowledged: UserID[];
  phase: LudumOriginalPhase;
  minigameEndTime: Timestamp | null;
  currentMinigame: LudumOriginalMinigame | null;
  currentMinigameState: LudumOriginalMinigameState | null;
  playersWhoPassedCurrentMinigame: UserID[];
  roundNumber: number;
  minigamesPlayedSoFar: LudumOriginalMinigame[];
}

export interface LudumOriginalCharacter {
  id: string;
  name: string;
  color: string;
}

export enum LudumOriginalPhase {
  INTRO = 'INTRO',
  PRE_MINIGAME = 'PRE_MINIGAME',
  PLAY_MINIGAME = 'PLAY_MINIGAME',
  MINIGAME_RESULTS = 'MINIGAME_RESULTS',
  GAME_OVER = 'GAME_OVER',
}

export interface LudumOriginalPlayer {
  userId: UserID;
  name: string;
  character: LudumOriginalCharacter;
  health: number;
}

export enum LudumOriginalShape {
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

export enum LudumOriginalMinigame {
  SIMON_SAYS = 'SIMON_SAYS',
  HYDRAULICS = 'HYDRAULICS',
  REFLEXES = 'REFLEXES',
  PIZZA = 'PIZZA',
}

export type LudumOriginalMinigameState =
  | LudumOriginalMinigameSimonSaysState
  | LudumOriginalMinigameHydraulicsState
  | LudumOriginalMinigameReflexesState
  | LudumOriginalMinigamePizzaState;

export type LudumOriginalMinigameAnswer =
  | LudumOriginalMinigameSimonSaysAnswer
  | LudumOriginalMinigameHydraulicsResult
  | LudumOriginalMinigamePizzaAnswer;

/**
 * Simon Says
 */

export type LudumOriginalMinigameSimonSaysAnswer = LudumOriginalShape[];

export interface LudumOriginalMinigameSimonSaysState {
  phrase: LudumOriginalShape[];
  timeBetweenShapes: number;
}

/**
 * Hydraulics
 */

export type LudumOriginalMinigameHydraulicsButton = [
  number,
  LudumOriginalMinigameHydraulicsButtonPosition
];

export type LudumOriginalMinigameHydraulicsButtonPosition = boolean[];
export type LudumOriginalMinigameHydraulicsResult = number[];

export interface LudumOriginalMinigameHydraulicsState {
  pipeMaxLevel: number;
  correctResult: LudumOriginalMinigameHydraulicsResult;
  startingResult: LudumOriginalMinigameHydraulicsResult;
  buttons: LudumOriginalMinigameHydraulicsButton[];
}

/**
 * Reflexes
 */

export type LudumOriginalMinigameReflexesState = {};

/**
 * Pizza
 */

export enum LudumOriginalMinigamePizzaTopping {
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

export enum LudumOriginalMinigamePizzaEvaluation {
  LIKE = 'LIKE',
  DISLIKE = 'DISLIKE',
  SKIP = 'SKIP',
}

export interface LudumOriginalMinigamePizzaCustomer {
  likes: LudumOriginalMinigamePizzaTopping[];
  dislikes: LudumOriginalMinigamePizzaTopping[];
  pizza: LudumOriginalMinigamePizzaTopping[];
  randomPizzaRotation: number;
  customerEvaluation: LudumOriginalMinigamePizzaEvaluation;
}

export interface LudumOriginalMinigamePizzaState {
  customers: LudumOriginalMinigamePizzaCustomer[];
  targetScore: number;
}

export type LudumOriginalMinigamePizzaAnswer = number;
