import {
  ResistanceGameState,
  ResistancePhase,
  ResistancePlayer,
  ResistanceRole,
  ResistanceMissionStatus,
  ResistanceMission,
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

const getTeamSize = (missionNumber: number, playerCount: number): number => {
  const teamSizeMap: { [playerCount: number]: number[] } = {
    5: [2, 3, 2, 3, 3],
    6: [2, 3, 4, 3, 4],
    7: [2, 3, 3, 4, 4],
    8: [3, 4, 4, 5, 5],
    9: [3, 4, 4, 5, 5],
    10: [3, 4, 4, 5, 5],
  };

  const teamSizeArr = teamSizeMap[playerCount];
  if (!teamSizeArr) {
    // just so it works for other counts for testing
    return 2;
  }

  return teamSizeArr[missionNumber - 1];
};

const getRequiresTwoFails = (
  missionNumber: number,
  playerCount: number
): boolean => {
  return missionNumber === 4 && playerCount >= 7 && playerCount <= 10;
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

  const missionHistory: ResistanceMission[] = [
    { number: 1, status: ResistanceMissionStatus.IN_PROGRESS },
    { number: 2, status: ResistanceMissionStatus.NOT_STARTED },
    { number: 3, status: ResistanceMissionStatus.NOT_STARTED },
    { number: 4, status: ResistanceMissionStatus.NOT_STARTED },
    { number: 5, status: ResistanceMissionStatus.NOT_STARTED },
  ].map(mission => ({
    ...mission,
    requiredPlayers: getTeamSize(mission.number, players.length),
    requiresTwoFails: getRequiresTwoFails(mission.number, players.length),
  }));

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
    allMissions: missionHistory as [
      ResistanceMission,
      ResistanceMission,
      ResistanceMission,
      ResistanceMission,
      ResistanceMission
    ],
    players,
  };
};
