import { GameID } from '../games/types';

export const START_GAME_MESSAGE = 'START_GAME_MESSAGE';

export interface StartGameMessage {
  type: typeof START_GAME_MESSAGE;
  payload: {
    gameType: GameID;
  };
}

export type ClientStateMessage = StartGameMessage;

export type ClientMessageActionTypes = StartGameMessage;
