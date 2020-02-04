import { SetClientState, SET_CLIENT_STATE, SetUser, SET_USER } from './types';
import { ServerStatePayload, User } from '@server/store/general/types';

export const setClientState = (state: ServerStatePayload): SetClientState => {
  return {
    type: SET_CLIENT_STATE,
    payload: state,
  };
};

export const setUser = (user: User): SetUser => {
  return {
    type: SET_USER,
    payload: {
      user,
    },
  };
};
