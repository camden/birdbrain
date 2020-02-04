import { ClientStateMessage } from '@server/store/client/types';

export const CONNECT_TO_ROOM = 'CONNECT_TO_ROOM';
export const SEND_MESSAGE = 'SEND_MESSAGE';

export interface ConnectToRoom {
  type: typeof CONNECT_TO_ROOM;
  payload: {
    roomId: string;
    name: string;
  };
}

export interface SendMessage {
  type: typeof SEND_MESSAGE;
  payload: ClientStateMessage;
}

export type WebsocketActionTypes = ConnectToRoom | SendMessage;
