import { GameID, GameState } from '../types';
import { UserID } from '../../general/types';

export interface ResistanceGameState extends GameState {
  type: GameID.THE_RESISTANCE;
  missionLeader: UserID;
}
