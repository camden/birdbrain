import { SetClientState, SET_CLIENT_STATE, SetUser, SET_USER } from './types';
import { ClientStatePayload, User } from '@server/store/general/types';

export const setClientState = (state: ClientStatePayload): SetClientState => {
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
