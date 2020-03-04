import uuid from 'uuid/v1';
import { Game, GameID, GameType } from '../games/types';
import {
  ClientMessage,
  StartGameMessage,
  PickGameTypeMessage,
} from '../client/types';
import { ResistanceActionTypes } from 'store/games/the-resistance/actions';

export type RoomID = string;

export interface Room {
  id: RoomID;
  users: UserID[];
  leaderUserID: UserID | null;
  game: GameID | null;
  selectedGameType: GameType | null;
}

export type UserID = string;

export interface User {
  id: UserID;
  name: string;
}

export class User {
  public id: UserID;
  public name: string;

  constructor(name: string, id?: UserID) {
    this.id = id || uuid();
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
export const CREATE_NEW_ROOM = 'CREATE_NEW_ROOM';

export interface ActionMeta {
  roomId: RoomID;
  userId: UserID;
  sendClientUpdate: boolean;
}

export interface AddUserToRoomAction {
  type: typeof ADD_USER_TO_ROOM;
  payload: {
    user: User;
    room: Room;
  };
  meta: ActionMeta;
}

export interface RemoveUserFromRoomAction {
  type: typeof REMOVE_USER_FROM_ROOM;
  payload: {
    user: User;
    room: Room;
  };
  meta: ActionMeta;
}

export interface ReceivedClientMessage {
  type: typeof RECEIVED_CLIENT_MESSAGE;
  payload: ClientMessage;
  meta: ActionMeta;
}

export interface CreateNewRoomAction {
  type: typeof CREATE_NEW_ROOM;
  payload: {
    roomId: string;
  };
}

export type GeneralActionTypes =
  | ResistanceActionTypes
  | PickGameTypeMessage
  | StartGameMessage
  | AddUserToRoomAction
  | CreateNewRoomAction
  | RemoveUserFromRoomAction
  | ReceivedClientMessage;
