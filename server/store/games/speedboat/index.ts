import { SpeedboatPlayer, SpeedboatGameState } from './types';
import { GameType, GameID } from '../types';
import { User } from 'store/general/types';

const createPlayerFromUser = (user: User): SpeedboatPlayer => {
  return {
    userId: user.id,
    name: user.name,
  };
};

export const createNewGameOfSpeedboat = (
  id: GameID,
  usersInRoom: User[]
): SpeedboatGameState => {
  const players = usersInRoom.map(createPlayerFromUser);

  return {
    id,
    type: GameType.SPEEDBOAT,
    players,
  };
};
