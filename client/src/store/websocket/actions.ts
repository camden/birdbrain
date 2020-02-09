import {
  ConnectToRoom,
  CONNECT_TO_ROOM,
  SendMessage,
  SEND_MESSAGE,
} from './types';
import { ClientMessage } from '@server/store/client/types';

export const connectToRoom = (roomId: string, name: string): ConnectToRoom => {
  return {
    type: CONNECT_TO_ROOM,
    payload: {
      roomId,
      name,
    },
  };
};

export const sendMessage = (message: ClientMessage): SendMessage => {
  return {
    type: SEND_MESSAGE,
    payload: message,
  };
};
