import { RootState } from '..';
import { createSelector } from 'reselect';
import { ServerStatePayload } from './types';

export interface SelectorFunction {
  (state: RootState): any;
}

export const getAllRooms = (state: RootState) => state.general.rooms;

export const getRoomById = (roomId: string) => (state: RootState) => {
  const room = state.general.rooms.find(room => room.id === roomId);
  if (!room) {
    return null;
  }

  return room;
};

export const getUsersInRoom = (roomId: string) =>
  createSelector(getRoomById(roomId), room => {
    return room?.users;
  });

export const getClientStateByRoomId = (roomId: string) =>
  createSelector(
    getRoomById(roomId),
    (room): ServerStatePayload => ({
      room,
    })
  );
