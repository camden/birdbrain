import {
  Room,
  User,
  GeneralActionTypes,
  ADD_USER_TO_ROOM,
  REMOVE_USER_FROM_ROOM,
} from './types';
import { ClientStateMessage } from '../client/types';

export const addUserToRoom = (room: Room, user: User): GeneralActionTypes => {
  return {
    type: ADD_USER_TO_ROOM,
    payload: {
      room,
      user,
    },
  };
};

export const removeUserFromRoom = (
  room: Room,
  user: User
): GeneralActionTypes => {
  return {
    type: REMOVE_USER_FROM_ROOM,
    payload: {
      room,
      user,
    },
  };
};

export const receivedClientMessage = (
  message: ClientStateMessage
): GeneralActionTypes => {
  return {
    type: message.type,
    payload: message.payload,
  };
};
