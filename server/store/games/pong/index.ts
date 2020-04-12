import { PongGameState, PongPlayer } from './types';
import { GameType, GameID } from '../types';
import { User } from 'store/general/types';

const createPlayerFromUser = (user: User): PongPlayer => {
  return {
    userId: user.id,
    name: user.name,
  };
};

export const createNewGameOfPong = (
  id: GameID,
  usersInRoom: User[]
): PongGameState => {
  const players = usersInRoom.map(createPlayerFromUser);

  return {
    id,
    type: GameType.PONG,
    players,
  };
};
