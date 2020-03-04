import { SkullGameState } from './types';
import { GameID, GameType } from '../types';
import { User } from 'store/general/types';

export const createNewGameOfSkull = (
  id: GameID,
  usersInRoom: User[]
): SkullGameState => {
  return {
    id,
    type: GameType.SKULL,
  };
};
