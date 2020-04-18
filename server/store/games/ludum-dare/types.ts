import { Game, GameType } from '../types';
import { UserID } from 'store/general/types';

export interface LudumGameState extends Game {
  type: GameType.LUDUM;
  players: LudumPlayer[];
}

export interface LudumPlayer {
  userId: UserID;
  name: string;
}
