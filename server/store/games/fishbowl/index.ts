import {
  FishbowlGameState,
  FishbowlPlayer,
  FishbowlTeam,
  FishbowlPhase,
  FishbowlAnswer,
  FishbowlGameType,
} from './types';
import { GameID, GameType } from '../types';
import { User, UserID } from 'store/general/types';
import shuffleArray from '../../../utils/shuffle-array';

export const DEFAULT_DURATION = 30500;
export const QUICK_DEBUG_DURATION = 10500;
export const LONG_DEBUG_DURATION = 60500;

export const ROUND_DURATION_MS =
  process.env.NODE_ENV === 'production'
    ? DEFAULT_DURATION
    : LONG_DEBUG_DURATION;
export const ANSWERS_PER_PLAYER = 1;
export const POINTS_FOR_GOT = 2;
export const POINTS_FOR_SKIPPED = -1;

export const TEAM_A_DISPLAY_NAME = 'TEAM BLUE';
export const TEAM_B_DISPLAY_NAME = 'TEAM RED';

const createPlayerFromUser = (
  user: User,
  team: FishbowlTeam
): FishbowlPlayer => {
  return {
    name: user.name,
    userId: user.id,
    team,
    teamDisplayName:
      team === FishbowlTeam.TEAM_A ? TEAM_A_DISPLAY_NAME : TEAM_B_DISPLAY_NAME,
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
  const teamsArray = shuffleArray([...unshuffledTeamArray]);
  const players = shuffleArray([
    ...usersInRoom.map((user, index) =>
      createPlayerFromUser(user, teamsArray[index])
    ),
  ]);

  const answersSubmitted: { [key in UserID]: FishbowlAnswer[] } = {};

  players.forEach(player => {
    answersSubmitted[player.userId] = [];
  });

  return {
    id,
    type: GameType.FISHBOWL,
    roundEndTime: null,
    players,
    lastActivePlayer: null,
    activePlayer: players[0],
    phase: FishbowlPhase.INPUT_ANSWERS,
    currentGameType: FishbowlGameType.TABOO,
    nextRoundDuration: ROUND_DURATION_MS,
    allAnswers: [],
    answersSubmitted,
    answersForCurrentGameType: [],
    answersGot: [],
    answersSkipped: [],
    acknowledged: [],
    score: {
      [FishbowlTeam.TEAM_A]: 0,
      [FishbowlTeam.TEAM_B]: 0,
    },
  };
};
