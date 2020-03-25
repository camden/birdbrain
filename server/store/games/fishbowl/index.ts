import {
  FishbowlGameState,
  FishbowlPlayer,
  FishbowlTeam,
  FishbowlPhase,
} from './types';
import { GameID, GameType } from '../types';
import { User } from 'store/general/types';
import shuffleArray from 'utils/shuffle-array';

export const DEFAULT_DURATION = 30500;
export const QUICK_DEBUG_DURATION = 10500;

export const ROUND_DURATION_MS = QUICK_DEBUG_DURATION;

const createPlayerFromUser = (
  user: User,
  team: FishbowlTeam
): FishbowlPlayer => {
  return {
    name: user.name,
    userId: user.id,
    team,
  };
};

export const createNewGameOfFishbowl = (
  id: GameID,
  usersInRoom: User[]
): FishbowlGameState => {
  const unshuffledTeamArray = [];
  const maxOnOneTeam = Math.ceil(usersInRoom.length / 2);
  for (let i = 0; i < usersInRoom.length; i++) {
    if (i < maxOnOneTeam) {
      unshuffledTeamArray.push(FishbowlTeam.TEAM_A);
    } else {
      unshuffledTeamArray.push(FishbowlTeam.TEAM_B);
    }
  }
  const teamsArray = shuffleArray(unshuffledTeamArray);
  const players = usersInRoom.map((user, index) =>
    createPlayerFromUser(user, teamsArray[index])
  );

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
