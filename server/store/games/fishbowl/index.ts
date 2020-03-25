import {
  FishbowlGameState,
  FishbowlPlayer,
  FishbowlTeam,
  FishbowlPhase,
} from './types';
import { GameID, GameType } from '../types';
import { User } from 'store/general/types';

export const DEFAULT_DURATION = 30500;
export const QUICK_DEBUG_DURATION = 10500;

export const ROUND_DURATION_MS = QUICK_DEBUG_DURATION;

const createPlayerFromUser = (user: User): FishbowlPlayer => {
  return {
    name: user.name,
    userId: user.id,
    team: FishbowlTeam.TEAM_A, // @TODO: RANDOMLY ASSIGN THIS
  };
};

export const createNewGameOfFishbowl = (
  id: GameID,
  usersInRoom: User[]
): FishbowlGameState => {
  const players = usersInRoom.map(createPlayerFromUser);

  return {
    id,
    type: GameType.FISHBOWL,
    roundEndTime: null,
    players,
    activePlayer: players[0],
    phase: FishbowlPhase.PRE_ROUND,
    currentAnswer: null,
    answersAlreadySeen: [],
    answersGot: [],
    answersSkipped: [],
    acknowledged: [],
  };
};
