import { LudumGameState, LudumPlayer, LudumPhase } from './types';
import { GameType, GameID } from '../types';
import { User } from 'store/general/types';

export const DEBUG_DURATION = 3050000;
export const DEFAULT_DURATION = 30500;

export const MINIGAME_DURATION_MS =
  process.env.NODE_ENV === 'production' ? DEFAULT_DURATION : DEBUG_DURATION;

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
    currentMinigameState: null,
    playersWhoPassedCurrentMinigame: [],
    roundNumber: 0,
  };
};
