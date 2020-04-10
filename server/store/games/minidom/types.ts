import { Game, GameType } from '../types';
import { UserID } from 'store/general/types';

export interface MinidomGameState extends Game {
  type: GameType.MINIDOM;
  players: MinidomPlayer[];
  shop: MinidomCardType[];
  activePlayerIndex: number;
  currentTurnPhase: MinidomTurnPhase;
}

export enum MinidomTurnPhase {
  MOVE = 'MOVE',
  PLAY = 'PLAY',
  BUY = 'BUY',
}

export interface MinidomPlayer {
  userId: UserID;
  name: string;
  collection: MinidomCardCollection;
  score: number;
  health: number;
  location: MinidomPlayerLocation;
  previousLocation: MinidomPlayerLocation | null;
  color: string;
}

export interface MinidomPlayerLocation {
  x: number;
  y: number;
}

export interface MinidomCardCollection {
  hand: MinidomCardType[];
  deck: MinidomCardType[];
  discardPile: MinidomCardType[];
}

export interface MinidomCardType {
  effect: MinidomCardEffect;
  value?: number;
  target?: MinidomCardTarget;
}

export type MinidomCardTarget = MinidomCardDirection;

export enum MinidomCardDirection {
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  UP = 'UP',
  DOWN = 'DOWN',
}

export enum MinidomCardEffect {
  GAIN_POINTS = 'GAIN_POINTS',
  GAIN_HEALTH = 'GAIN_HEALTH',
  MOVE = 'MOVE',
}

export const MinidomCardEffectTitles: { [key in MinidomCardEffect]: string } = {
  [MinidomCardEffect.MOVE]: 'Move',
  [MinidomCardEffect.GAIN_HEALTH]: 'Gain Health',
  [MinidomCardEffect.GAIN_POINTS]: 'Gain Points',
};
