import { Game, GameType } from '../types';
import { UserID } from 'store/general/types';

export interface MinidomGameState extends Game {
  type: GameType.MINIDOM;
  players: MinidomPlayer[];
  shop: MinidomCardType[];
  turnIndex: number;
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
}

export interface MinidomPlayerLocation {
  x: 0 | 1 | 2;
  y: 0 | 1 | 2;
}

export interface MinidomCardCollection {
  hand: MinidomCardType[];
  deck: MinidomCardType[];
  discardPile: MinidomCardType[];
}

export interface MinidomCardType {
  effect: MinidomCardEffect;
  value: number;
}

export enum MinidomCardEffect {
  GAIN_POINTS = 'GAIN_POINTS',
  GAIN_HEALTH = 'GAIN_HEALTH',
  MOVE = 'MOVE',
}
