import { Game, GameType } from '../types';

export type Timestamp = number;

export interface FishbowlGameState extends Game {
  type: GameType.FISHBOWL;
  roundStartTime: Timestamp | null;
}
