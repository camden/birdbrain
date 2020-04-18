import { Game, GameType } from '../types';
import { UserID } from 'store/general/types';

export interface LudumGameState extends Game {
  type: GameType.LUDUM;
  players: LudumPlayer[];
  acknowledged: LudumPlayer[];
  phase: LudumPhase;
}

export enum LudumPhase {
  INTRO = 'INTRO',
  PLAY_MINIGAME = 'PLAY_MINIGAME',
  MINIGAME_RESULTS = 'MINIGAME_RESULTS',
  GAME_OVER = 'GAME_OVER',
}

export interface LudumPlayer {
  userId: UserID;
  name: string;
}
