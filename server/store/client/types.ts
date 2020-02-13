import { GameType } from '../games/types';
import { RoomID, UserID, ActionMeta } from '../general/types';

export const START_GAME_MESSAGE = 'START_GAME_MESSAGE';

export interface StartGameMessage {
  type: typeof START_GAME_MESSAGE;
  payload: {
    gameType: GameType;
  };
  meta: ActionMeta;
}

export interface ClientMessage {
  type: string;
  payload?: any;
}

export interface ClientMessageMeta {
  meta: {
    roomId: RoomID;
    userId: UserID;
    sendClientUpdate: boolean;
  };
}

export type ClientMessageWithMeta = ClientMessage & ClientMessageMeta;

export type ClientMessageActionTypes = ClientMessageWithMeta;
