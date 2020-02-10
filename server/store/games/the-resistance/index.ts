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

export const createNewGameOfTheResistance = (
  id: GameID,
  usersInRoom: User[]
): ResistanceGameState => {
  const players: ResistancePlayer[] = usersInRoom.map(createPlayerFromUser);

  return {
    id,
    type: GameType.THE_RESISTANCE,
    missionLeader: '',
    mission: 1,
    phase: ResistancePhase.PICK_TEAM,
    players,
  };
};
