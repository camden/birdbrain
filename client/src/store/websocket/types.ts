export const CONNECT_TO_ROOM = 'CONNECT_TO_ROOM';

export interface ConnectToRoom {
  type: typeof CONNECT_TO_ROOM;
  payload: {
    roomId: string;
    name: string;
  };
}

export type WebsocketActionTypes = ConnectToRoom;
