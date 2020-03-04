import uuid from 'uuid/v1';
import { Game, GameType, GameID } from './types';
import { createNewGameOfTheResistance } from './the-resistance';
import { createNewGameOfSkull } from './skull';
import { User } from 'store/general/types';

export const generateGameId = (type: GameType): GameID => {
  return uuid();
};

export const createNewGame = (type: GameType, usersInRoom: User[]): Game => {
  switch (type) {
    case GameType.THE_RESISTANCE:
      return createNewGameOfTheResistance(generateGameId(type), usersInRoom);
    case GameType.SKULL:
      return createNewGameOfSkull(generateGameId(type), usersInRoom);
  }
};
