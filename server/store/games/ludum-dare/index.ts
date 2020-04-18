import { LudumGameState, LudumPlayer, LudumPhase } from './types';
import { GameType, GameID } from '../types';
import { User } from 'store/general/types';

export const MINIGAME_DURATION_MS = 5500;

const createPlayerFromUser = (user: User): LudumPlayer => {
  return {
    userId: user.id,
    name: user.name,
  };
};

export const createNewGameOfLudum = (
  id: GameID,
  usersInRoom: User[]
): LudumGameState => {
  const players = usersInRoom.map(createPlayerFromUser);

  return {
    id,
    type: GameType.LUDUM,
    players,
    acknowledged: [],
    phase: LudumPhase.INTRO,
    minigameEndTime: null,
    currentMinigame: null,
    roundNumber: 0,
  };
};
