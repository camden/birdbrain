import { ConnectToRoom, CONNECT_TO_ROOM } from './types';

export const connectToRoom = (roomId: string, name: string): ConnectToRoom => {
  return {
    type: CONNECT_TO_ROOM,
    payload: {
      roomId,
      name,
    },
  };
};
