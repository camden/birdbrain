import { WebsocketActionTypes } from './websocket/types';
import { Room, ClientStatePayload } from '@server/store/general/types';

export interface ClientState {
  room: Room | null;
}

// ACTIONS

export const SET_CLIENT_STATE = 'SET_CLIENT_STATE';

export interface SetClientState {
  type: typeof SET_CLIENT_STATE;
  payload: ClientStatePayload;
}

export type ActionTypes = SetClientState | WebsocketActionTypes;
