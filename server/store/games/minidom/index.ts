import {
  MinidomGameState,
  MinidomPlayer,
  MinidomCardEffect,
  MinidomCard,
  MinidomCardCollection,
} from './types';
import { GameType, GameID } from '../types';
import { User } from 'store/general/types';

const startingDeck: MinidomCard[] = [
  {
    effect: MinidomCardEffect.GAIN_POINTS,
    value: 1,
  },
  {
    effect: MinidomCardEffect.GAIN_POINTS,
    value: 1,
  },
  {
    effect: MinidomCardEffect.GAIN_POINTS,
    value: 2,
  },
];

const createStartingCollection = (): MinidomCardCollection => {
  return {
    deck: startingDeck,
    hand: [],
    discardPile: [],
  };
};

const createPlayerFromUser = (user: User): MinidomPlayer => {
  return {
    userId: user.id,
    name: user.name,
    collection: createStartingCollection(),
    score: 0,
    health: 10,
  };
};

export const createNewGameOfMinidom = (
  id: GameID,
  usersInRoom: User[]
): MinidomGameState => {
  const players = usersInRoom.map(createPlayerFromUser);

  return {
    id,
    type: GameType.MINIDOM,
    players,
  };
};
