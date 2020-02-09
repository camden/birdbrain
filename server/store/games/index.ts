import uuid from 'uuid/v1';
import { Game, GameType, GameID } from './types';
import { createNewGameOfTheResistance } from './the-resistance';

export const generateGameId = (type: GameType): GameID => {
  return uuid();
};

export const createNewGame = (type: GameType): Game => {
  return createNewGameOfTheResistance(generateGameId(type));
};
