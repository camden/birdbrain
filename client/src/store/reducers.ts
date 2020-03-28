import { ClientState, ActionTypes, SET_CLIENT_STATE, SET_USER } from './types';

const initialState: ClientState = {
  room: null,
  user: null,
  usersInRoom: [],
  game: null,
};

export const reducer = (state = initialState, action: ActionTypes) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        user: action.payload.user,
      };
    case SET_CLIENT_STATE:
      if (process.env.NODE_ENV !== 'production') {
        console.log('Got Client State: ', action);
      }
      return {
        ...state,
        room: action.payload.room,
        usersInRoom: action.payload.usersInRoom,
        game: action.payload.game,
      };
    default:
      return state;
  }
};
