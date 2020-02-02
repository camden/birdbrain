import { RoomID } from './store/general/types';

export type ClientMessageKind = string; //for now...
export type ClientMessagePayload = any;

export interface ClientMessage {
  roomId: RoomID;
  kind: ClientMessageKind;
  payload: ClientMessagePayload;
}
