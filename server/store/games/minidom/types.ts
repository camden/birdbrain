import { Game, GameType } from '../types';
import { UserID } from 'store/general/types';

export interface MinidomGameState extends Game {
  type: GameType.MINIDOM;
  players: MinidomPlayer[];
}

export interface MinidomPlayer {
  userId: UserID;
  name: string;
  collection: MinidomCardCollection;
  score: number;
  health: number;
}

export interface MinidomCardCollection {
  hand: MinidomCard[];
  deck: MinidomCard[];
  discardPile: MinidomCard[];
}

export interface MinidomCard {
  effect: MinidomCardEffect;
  value: number;
}

export enum MinidomCardEffect {
  GAIN_POINTS = 'GAIN_POINTS',
}
