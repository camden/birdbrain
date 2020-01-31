import uuid from 'uuid/v1';

export interface Room {
  id: string;
  users: User[];
  leaderUserID: UserID | null;
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

export interface GeneralState {
  rooms: Room[];
}

// ---| ACTIONS |-----------------

export const ADD_USER_TO_ROOM = 'ADD_USER_TO_ROOM';
export const REMOVE_USER_FROM_ROOM = 'REMOVE_USER_FROM_ROOM';

interface AddUserToRoomAction {
  type: typeof ADD_USER_TO_ROOM;
  payload: {
    user: User;
    room: Room;
  };
}

interface RemoveUserFromRoomAction {
  type: typeof REMOVE_USER_FROM_ROOM;
  payload: {
    user: User;
    room: Room;
  };
}

export type GeneralActionTypes = AddUserToRoomAction | RemoveUserFromRoomAction;
