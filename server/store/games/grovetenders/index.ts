import { GroveGameState, GrovePlayer, GroveCardEffect } from './types';
import { GameType, GameID } from '../types';
import { User } from 'store/general/types';
import shuffleArray from 'utils/shuffle-array';
import { pickRandomNumber, pickElement } from 'utils/rng';

export const STARTING_CARD_PLAYS = 2;

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
    location: {
      x: 0,
      y: 0,
    },
    previousLocation: null,
    color: pickElement(colors)[0] || 'black',
  };
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
  };
};
