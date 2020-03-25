import {
  FishbowlGameState,
  FishbowlPlayer,
  FishbowlTeam,
  FishbowlPhase,
} from './types';
import { GameID, GameType } from '../types';
import { User } from 'store/general/types';

export const ROUND_DURATION_MS = 30000;

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
    roundStartTime: null,
    players,
    activePlayer: players[0],
    phase: FishbowlPhase.PRE_ROUND,
  };
};
