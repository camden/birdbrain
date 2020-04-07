import { Game, GameType } from '../types';
import { UserID } from 'store/general/types';

export interface MinidomGameState extends Game {
  type: GameType.MINIDOM;
  players: MinidomPlayer[];
  shop: MinidomCardType[];
}

export interface MinidomPlayer {
  userId: UserID;
  name: string;
  collection: MinidomCardCollection;
  score: number;
  health: number;
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
}
