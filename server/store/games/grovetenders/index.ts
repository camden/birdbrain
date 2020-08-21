import {
  GroveGameState,
  GrovePlayer,
  GroveCardEffect,
  GroveCardType,
  GroveCardCollection,
  GroveTurnPhase,
  GroveCardDirection,
} from './types';
import { GameType, GameID } from '../types';
import { User } from 'store/general/types';
import shuffleArray from 'utils/shuffle-array';
import { pickRandomNumber, pickElement } from 'utils/rng';

export const STARTING_CARD_PLAYS = 2;

const startingDeck: GroveCardType[] = [
  {
    effect: GroveCardEffect.GAIN_POINTS,
    value: 2,
  },
  {
    effect: GroveCardEffect.GAIN_MONEY,
    value: 1,
  },
  {
    effect: GroveCardEffect.MOVE,
    target: GroveCardDirection.RIGHT,
  },
];

const createStartingCollection = (): GroveCardCollection => {
  const deck = shuffleArray([...startingDeck]);

  if (deck.length < 3) {
    throw new Error('Cannot start game with less than 3 cards.');
  }

  const startingHand = [deck.pop(), deck.pop(), deck.pop()];

  return {
    deck,
    hand: startingHand as GroveCardType[],
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
  'cyan',
  'black',
  'yellow',
  'green',
  'blue',
  'hotpink',
];

const createPlayerFromUser = (user: User): GrovePlayer => {
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

const generateShopCards = (): GroveCardType[] => {
  return [
    {
      effect: GroveCardEffect.GAIN_MONEY,
      value: 99,
    },
    {
      effect: GroveCardEffect.GAIN_MONEY,
      value: 99,
    },
    {
      effect: GroveCardEffect.GAIN_MONEY,
      value: 99,
    },
  ];
};

export const createNewGameOfGrove = (
  id: GameID,
  usersInRoom: User[]
): GroveGameState => {
  const players = shuffleArray(usersInRoom.map(createPlayerFromUser));

  return {
    id,
    type: GameType.GROVETENDERS,
    players,
    shop: generateShopCards(),
    activePlayerIndex: 0,
    cardPlaysRemaining: STARTING_CARD_PLAYS,
    currentTurnPhase: GroveTurnPhase.MOVE,
  };
};
