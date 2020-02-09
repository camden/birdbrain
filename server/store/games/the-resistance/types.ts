import { GameType, Game } from '../types';
import { UserID } from '../../general/types';

export interface ResistanceGameState extends Game {
  type: GameType.THE_RESISTANCE;
  missionLeader: UserID;
}
