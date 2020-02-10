import uuid from 'uuid/v1';
import { Game, GameType, GameID } from './types';
import { createNewGameOfTheResistance } from './the-resistance';
import { User } from '../general/types';

export const generateGameId = (type: GameType): GameID => {
  return uuid();
};

export const createNewGame = (type: GameType, usersInRoom: User[]): Game => {
  return createNewGameOfTheResistance(generateGameId(type), usersInRoom);
};
