import {
  ResistanceGameState,
  ResistancePhase,
  ResistancePlayer,
  ResistanceRole,
} from './types';
import { GameType, GameID } from '../types';
import { User } from 'store/general/types';
import { pickRandomNumber } from 'utils/rng';
import shuffleArray from 'utils/shuffle-array';

const createPlayerFromUser = (
  user: User,
  role: ResistanceRole
): ResistancePlayer => ({
  role,
  userId: user.id,
  name: user.name,
});

const getNumberOfSpiesByPlayerCount = (playerCount: number): number => {
  if (playerCount < 5) {
    // this is not technically supported
    return 1;
  }

  if (playerCount > 10) {
    // this is not technically supported
    return 5;
  }

  const counts: { [playerCount: number]: number } = {
    5: 2,
    6: 2,
    7: 3,
    8: 3,
    9: 3,
    10: 4,
  };

  return counts[playerCount];
};

export const createNewGameOfTheResistance = (
  id: GameID,
  usersInRoom: User[]
): ResistanceGameState => {
  const numSpies = getNumberOfSpiesByPlayerCount(usersInRoom.length);
  const unshuffledRoleArray = [];
  for (let i = 0; i < usersInRoom.length; i++) {
    if (i < numSpies) {
      unshuffledRoleArray.push(ResistanceRole.Spy);
    } else {
      unshuffledRoleArray.push(ResistanceRole.Resistance);
    }
  }
  const roleArray = shuffleArray(unshuffledRoleArray);

  const players: ResistancePlayer[] = usersInRoom.map((user, index) =>
    createPlayerFromUser(user, roleArray[index])
  );

  const missionLeader = players[pickRandomNumber(0, players.length - 1)];

  return {
    id,
    type: GameType.THE_RESISTANCE,
    missionLeader,
    mission: 1,
    missionTeam: [],
    teamApprovalVotes: [],
    teamRejectVotes: [],
    missionSuccessVotes: [],
    missionFailVotes: [],
    acknowledged: [],
    phase: ResistancePhase.PICK_TEAM,
    missionHistory: [],
    players,
  };
};
