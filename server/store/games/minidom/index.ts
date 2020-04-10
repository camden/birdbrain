import {
  MinidomGameState,
  MinidomPlayer,
  MinidomCardEffect,
  MinidomCardType,
  MinidomCardCollection,
  MinidomTurnPhase,
  MinidomCardDirection,
} from './types';
import { GameType, GameID } from '../types';
import { User } from 'store/general/types';
import shuffleArray from 'utils/shuffle-array';
import { pickRandomNumber, pickElement } from 'utils/rng';

const startingDeck: MinidomCardType[] = [
  {
    effect: MinidomCardEffect.GAIN_POINTS,
    value: 2,
  },
  {
    effect: MinidomCardEffect.GAIN_HEALTH,
    value: 1,
  },
  {
    effect: MinidomCardEffect.MOVE,
    target: MinidomCardDirection.RIGHT,
  },
];

const createStartingCollection = (): MinidomCardCollection => {
  return {
    deck: startingDeck,
    hand: [],
    discardPile: [],
  };
};

const colors = [
  'teal',
  'darkblue',
  'lightgrey',
  'orange',
  'darkgreen',
  'red',
  'purple',
  'indigo',
];

const createPlayerFromUser = (user: User): MinidomPlayer => {
  return {
    userId: user.id,
    name: user.name,
    collection: createStartingCollection(),
    score: 0,
    health: 10,
    location: {
      x: 0,
      y: 0,
    },
    previousLocation: null,
    color: pickElement(colors)[0] || 'black',
  };
};

export const createNewGameOfMinidom = (
  id: GameID,
  usersInRoom: User[]
): MinidomGameState => {
  const players = shuffleArray(usersInRoom.map(createPlayerFromUser));

  return {
    id,
    type: GameType.MINIDOM,
    players,
    shop: [],
    turnIndex: 0,
    currentTurnPhase: MinidomTurnPhase.MOVE,
  };
};
