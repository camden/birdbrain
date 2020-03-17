import { FishbowlGameState } from './types';
import { GameID, GameType } from '../types';
import { User } from 'store/general/types';

export const ROUND_DURATION_MS = 30000;

export const createNewGameOfFishbowl = (
  id: GameID,
  usersInRoom: User[]
): FishbowlGameState => {
  return {
    id,
    type: GameType.FISHBOWL,
    roundStartTime: null,
  };
};
