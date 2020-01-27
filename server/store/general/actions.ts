import { Room, User, GeneralActionTypes, ADD_USER_TO_ROOM } from './types';

export const addUserToRoom = (room: Room, user: User): GeneralActionTypes => {
  return {
    type: ADD_USER_TO_ROOM,
    payload: {
      room,
      user,
    },
  };
};
