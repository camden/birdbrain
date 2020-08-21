import uuid from 'uuid/v4';
import { Game, GameType, GameID } from './types';
import { createNewGameOfTheResistance } from './the-resistance';
import { createNewGameOfSkull } from './skull';
import { createNewGameOfChat } from './chat';
import { createNewGameOfFishbowl } from './fishbowl';
import { createNewGameOfMinidom } from './minidom';
import { createNewGameOfPong } from './pong';
import { createNewGameOfLudum } from './ludum-dare';
import { createNewGameOfLudumOriginal } from './ludum-dare-original';
import { createNewGameOfSpeedboat } from './speedboat';
import { createNewGameOfScoreCounter } from './score-counter';
import { createNewGameOfGrove } from './grovetenders';
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
    case GameType.CHAT:
      return createNewGameOfChat(generateGameId(type), usersInRoom);
    case GameType.FISHBOWL:
      return createNewGameOfFishbowl(generateGameId(type), usersInRoom);
    case GameType.MINIDOM:
      return createNewGameOfMinidom(generateGameId(type), usersInRoom);
    case GameType.PONG:
      return createNewGameOfPong(generateGameId(type), usersInRoom);
    case GameType.LUDUM_ORIGINAL:
      return createNewGameOfLudumOriginal(generateGameId(type), usersInRoom);
    case GameType.LUDUM:
      return createNewGameOfLudum(generateGameId(type), usersInRoom);
    case GameType.SPEEDBOAT:
      return createNewGameOfSpeedboat(generateGameId(type), usersInRoom);
    case GameType.SCORE_COUNTER:
      return createNewGameOfScoreCounter(generateGameId(type), usersInRoom);
    case GameType.GROVETENDERS:
      return createNewGameOfGrove(generateGameId(type), usersInRoom);
  }
};
