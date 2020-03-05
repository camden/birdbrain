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
    messages: [
      {
        id: '1',
        text: 'Hello world',
        author: players[0].userId,
      },
      {
        id: '2',
        text: 'Hello world',
        author: 'asdf',
      },
      {
        id: '3',
        text: 'Hello world',
        author: 'asdf',
      },
      {
        id: '4',
        text: 'Hello world',
        author: 'asdf',
      },
      {
        id: '5',
        text: 'Hello world',
        author: 'asdf',
      },
      {
        id: '6',
        text: 'Hello world',
        author: players[0].userId,
      },
      {
        id: '7',
        text: 'Hello world',
        author: players[0].userId,
      },
      {
        id: '8',
        text: 'Hello world',
        author: players[0].userId,
      },
    ],
  };
};
