import {
  ResistanceGameState,
  ResistancePhase,
  ResistancePlayer,
  ResistanceRole,
} from './types';
import { GameType, GameID } from '../types';
import { User } from 'server/store/general/types';

const createPlayerFromUser = (user: User): ResistancePlayer => ({
  role: Math.random() > 0.5 ? ResistanceRole.Resistance : ResistanceRole.Spy,
  userId: user.id,
  name: user.name,
});

const pickRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const createNewGameOfTheResistance = (
  id: GameID,
  usersInRoom: User[]
): ResistanceGameState => {
  const players: ResistancePlayer[] = usersInRoom.map(createPlayerFromUser);
  const missionLeader = players[pickRandomNumber(0, players.length - 1)];

  return {
    id,
    type: GameType.THE_RESISTANCE,
    missionLeader,
    mission: 1,
    phase: ResistancePhase.PICK_TEAM,
    players,
  };
};
