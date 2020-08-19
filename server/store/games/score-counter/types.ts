import { Game, GameType } from '../types';
import { UserID } from 'store/general/types';

export interface ScoreCounterGameState extends Game {
  type: GameType.SCORE_COUNTER;
  players: ScoreCounterPlayer[];
}

export interface ScoreCounterPlayer {
  userId: UserID;
  name: string;
}
