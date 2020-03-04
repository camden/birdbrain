import { Game, GameType } from '../types';

export interface SkullGameState extends Game {
  type: GameType.SKULL;
}
