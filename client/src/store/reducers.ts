import { ClientState, ActionTypes, SET_CLIENT_STATE, SET_USER } from './types';

const initialState: ClientState = {
  room: null,
  user: null,
  usersInRoom: [],
};

export const reducer = (state = initialState, action: ActionTypes) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        user: action.payload.user,
      };
    case SET_CLIENT_STATE:
      return {
        ...state,
        room: action.payload.room,
        usersInRoom: action.payload.usersInRoom,
      };
    default:
      return state;
  }
};
