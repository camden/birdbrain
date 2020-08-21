import { Game, GameType } from '../types';
import { UserID } from 'store/general/types';

export interface GroveGameState extends Game {
  type: GameType.GROVETENDERS;
  players: GrovePlayer[];
  shop: GroveCardType[];
  activePlayerIndex: number;
  currentTurnPhase: GroveTurnPhase;
  cardPlaysRemaining: number;
}

export enum GroveTurnPhase {
  MOVE = 'MOVE',
  PLAY = 'PLAY',
  BUY = 'BUY',
}

export interface GrovePlayer {
  userId: UserID;
  name: string;
  collection: GroveCardCollection;
  score: number;
  health: number;
  location: GrovePlayerLocation;
  previousLocation: GrovePlayerLocation | null;
  color: string;
}

export interface GrovePlayerLocation {
  x: number;
  y: number;
}

export interface GroveCardCollection {
  hand: GroveCardType[];
  deck: GroveCardType[];
  discardPile: GroveCardType[];
}

export interface GroveCardType {
  effect: GroveCardEffect;
  value?: number;
  target?: GroveCardTarget;
}

export type GroveCardTarget = GroveCardDirection;

export enum GroveCardDirection {
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  UP = 'UP',
  DOWN = 'DOWN',
}

export enum GroveCardEffect {
  GAIN_POINTS = 'GAIN_POINTS',
  GAIN_HEALTH = 'GAIN_HEALTH',
  GAIN_MONEY = 'GAIN_MONEY',
  MOVE = 'MOVE',
}

export const GroveCardEffectTitles: {
  [key in GroveCardEffect]: string;
} = {
  [GroveCardEffect.MOVE]: 'Move',
  [GroveCardEffect.GAIN_HEALTH]: 'Gain Health',
  [GroveCardEffect.GAIN_POINTS]: 'Gain Points',
  [GroveCardEffect.GAIN_MONEY]: 'Gain Money',
};
