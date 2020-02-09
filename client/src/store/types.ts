import { WebsocketActionTypes } from './websocket/types';
import { Room, ServerStatePayload, User } from '@server/store/general/types';
import { Game } from '@server/store/games/types';

export interface ClientState {
  room: Room | null;
  user: User | null;
  usersInRoom: User[];
  game: Game | null;
}

// ACTIONS

export const SET_CLIENT_STATE = 'SET_CLIENT_STATE';
export const SET_USER = 'SET_USER';

export interface SetClientState {
  type: typeof SET_CLIENT_STATE;
  payload: ServerStatePayload;
}

export interface SetUser {
  type: typeof SET_USER;
  payload: {
    user: User;
  };
}

export type ActionTypes = SetClientState | SetUser | WebsocketActionTypes;
