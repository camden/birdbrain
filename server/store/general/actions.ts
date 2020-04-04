import {
  Room,
  User,
  ADD_USER_TO_ROOM,
  CREATE_NEW_ROOM,
  REMOVE_USER_FROM_ROOM,
  AddUserToRoomAction,
  RemoveUserFromRoomAction,
  CreateNewRoomAction,
  EndCurrentGameAction,
  END_CURRENT_GAME,
} from './types';
import { ClientMessageWithMeta } from '../client/types';

export const addUserToRoom = (room: Room, user: User): AddUserToRoomAction => {
  return {
    type: ADD_USER_TO_ROOM,
    payload: {
      room,
      user,
    },
    meta: {
      roomId: room.id,
      userId: user.id,
      sendClientUpdate: true,
      timestamp: Date.now(),
    },
  };
};

export const removeUserFromRoom = (
  room: Room,
  user: User
): RemoveUserFromRoomAction => {
  return {
    type: REMOVE_USER_FROM_ROOM,
    payload: {
      room,
      user,
    },
    meta: {
      roomId: room.id,
      userId: user.id,
      sendClientUpdate: true,
      timestamp: Date.now(),
    },
  };
};

export const receivedClientMessage = (message: ClientMessageWithMeta) => {
  return {
    type: message.type,
    payload: message.payload,
    meta: {
      roomId: message.meta.roomId,
      userId: message.meta.userId,
      sendClientUpdate: message.meta.sendClientUpdate ?? true,
      timestamp: Date.now(),
    },
  };
};

export const createNewRoom = (roomId: string): CreateNewRoomAction => {
  return {
    type: CREATE_NEW_ROOM,
    payload: {
      roomId,
    },
  };
};

export const endCurrentGame = () => {
  return {
    type: END_CURRENT_GAME,
  };
};
