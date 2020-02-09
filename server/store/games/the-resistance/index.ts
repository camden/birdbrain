import { ResistanceGameState } from './types';
import { GameType, GameID } from '../types';

export const createNewGameOfTheResistance = (
  id: GameID
): ResistanceGameState => {
  return {
    id,
    type: GameType.THE_RESISTANCE,
    missionLeader: '',
  };
};
