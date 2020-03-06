import { ChatGameState, ChatPlayer } from './types';
import { GameType, GameID } from '../types';
import { User } from 'store/general/types';

const createPlayerFromUser = (user: User): ChatPlayer => {
  return {
    userId: user.id,
    name: user.name,
  };
};

export const createNewGameOfChat = (
  id: GameID,
  usersInRoom: User[]
): ChatGameState => {
  const players = usersInRoom.map(createPlayerFromUser);

  return {
    id,
    type: GameType.CHAT,
    players,
    messages: [],
  };
};
