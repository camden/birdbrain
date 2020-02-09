import { GameType } from '../games/types';
import { RoomID } from '../general/types';

export const START_GAME_MESSAGE = 'START_GAME_MESSAGE';

export interface StartGameMessage {
  type: typeof START_GAME_MESSAGE;
  payload: {
    gameType: GameType;
  };
}

export type ClientMessage = StartGameMessage;

export interface ClientMessageMeta {
  meta: {
    roomId: RoomID;
    sendClientUpdate: boolean;
  };
}

export type ClientMessageWithMeta = ClientMessage & ClientMessageMeta;

export type ClientMessageActionTypes = ClientMessageWithMeta;
