import uuid from 'uuid/v1';
import { Game, GameID } from '../games/types';
import { ClientMessage, ClientMessageActionTypes } from '../client/types';

export type RoomID = string;

export interface Room {
  id: RoomID;
  users: string[];
  leaderUserID: UserID | null;
  game: GameID | null;
}

export type UserID = string;

export interface User {
  id: UserID;
  name: string;
}

export class User {
  public id: UserID;
  public name: string;

  constructor(name: string) {
    this.id = uuid();
    this.name = name;
  }
}

export interface NormalizedObjects<T> {
  byId: { [id: string]: T };
  allIds: string[];
}

export interface GeneralState {
  entities: {
    rooms: NormalizedObjects<Room>;
    users: NormalizedObjects<User>;
    games: NormalizedObjects<Game>;
  };
}

export interface ServerStatePayload {
  room: Room | null; // should this be nullable?
  game: Game | null;
  usersInRoom: User[];
}

// ---| ACTIONS |-----------------

export const ADD_USER_TO_ROOM = 'ADD_USER_TO_ROOM';
export const REMOVE_USER_FROM_ROOM = 'REMOVE_USER_FROM_ROOM';
export const RECEIVED_CLIENT_MESSAGE = 'RECEIVED_CLIENT_MESSAGE';

export interface AddUserToRoomAction {
  type: typeof ADD_USER_TO_ROOM;
  payload: {
    user: User;
    room: Room;
  };
}

export interface RemoveUserFromRoomAction {
  type: typeof REMOVE_USER_FROM_ROOM;
  payload: {
    user: User;
    room: Room;
  };
}

export interface ReceivedClientMessage {
  type: typeof RECEIVED_CLIENT_MESSAGE;
  payload: ClientMessage;
}

export type GeneralActionTypes =
  | ClientMessageActionTypes
  | AddUserToRoomAction
  | RemoveUserFromRoomAction
  | ReceivedClientMessage;
