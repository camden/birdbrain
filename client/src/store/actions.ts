import { SetClientState, SET_CLIENT_STATE } from './types';
import { ClientStatePayload } from '@server/store/general/types';

export const setClientState = (state: ClientStatePayload): SetClientState => {
  return {
    type: SET_CLIENT_STATE,
    payload: state,
  };
};
