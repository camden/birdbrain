import { Game, GameType } from '../types';
import { UserID } from 'store/general/types';

export interface PongGameState extends Game {
  type: GameType.PONG;
  players: PongPlayer[];
}

export interface PongPlayer {
  userId: string;
  name: string;
  position: {
    x: number;
    y: number;
  };
}
