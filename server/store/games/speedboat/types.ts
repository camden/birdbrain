import { Game, GameType } from '../types';
import { UserID } from 'store/general/types';

export interface SpeedboatGameState extends Game {
  type: GameType.SPEEDBOAT;
  players: SpeedboatPlayer[];
}

export interface SpeedboatPlayer {
  userId: UserID;
  name: string;
}
