import { ClientState, ActionTypes, SET_CLIENT_STATE } from './types';

const initialState: ClientState = {
  room: null,
};

export const reducer = (state = initialState, action: ActionTypes) => {
  switch (action.type) {
    case SET_CLIENT_STATE:
      console.log(action.payload);
      return {
        ...state,
        room: action.payload.room,
      };
    default:
      return state;
  }
};
