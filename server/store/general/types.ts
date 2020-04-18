import uuid from 'uuid/v4';
import { Game, GameID, GameType } from '../games/types';
import {
  ClientMessage,
  StartGameMessage,
  PickGameTypeMessage,
} from '../client/types';
import { ResistanceActionTypes } from 'store/games/the-resistance/actions';
import { ChatActionTypes } from 'store/games/chat/actions';
import { FishbowlActionTypes } from 'store/games/fishbowl/actions';
import { MinidomActionTypes } from 'store/games/minidom/actions';
import { PongActionTypes } from 'store/games/pong/actions';
import { LudumActionTypes } from 'store/games/ludum-dare/actions';

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
export const END_CURRENT_GAME = 'END_CURRENT_GAME';

export type Timestamp = number;

export interface ActionMeta {
  roomId: RoomID;
  userId: UserID;
  sendClientUpdate: boolean;
  timestamp: Timestamp;
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

export interface EndCurrentGameAction {
  type: typeof END_CURRENT_GAME;
  meta: ActionMeta;
}

export type GameActionTypes =
  | LudumActionTypes
  | PongActionTypes
  | MinidomActionTypes
  | FishbowlActionTypes
  | ChatActionTypes
  | ResistanceActionTypes;

export type GeneralActionTypes =
  | GameActionTypes
  | PickGameTypeMessage
  | StartGameMessage
  | AddUserToRoomAction
  | CreateNewRoomAction
  | RemoveUserFromRoomAction
  | EndCurrentGameAction
  | ReceivedClientMessage;
