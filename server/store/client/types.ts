import { GameType } from '../games/types';
import { RoomID, BaseAction, UserID } from '../general/types';

export const START_GAME_MESSAGE = 'START_GAME_MESSAGE';

export interface StartGameMessage extends BaseAction {
  type: typeof START_GAME_MESSAGE;
  payload: {
    gameType: GameType;
  };
}

export interface ClientMessage {
  type: string;
  payload: any;
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
