import {
  ConnectToRoom,
  CONNECT_TO_ROOM,
  SendMessage,
  SEND_MESSAGE,
} from './types';
import { ClientStateMessage } from '@server/store/general/types';

export const connectToRoom = (roomId: string, name: string): ConnectToRoom => {
  return {
    type: CONNECT_TO_ROOM,
    payload: {
      roomId,
      name,
    },
  };
};

export const sendMessage = (message: ClientStateMessage): SendMessage => {
  return {
    type: SEND_MESSAGE,
    payload: message,
  };
};
