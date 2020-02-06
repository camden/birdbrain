import { RootState } from '..';
import { createSelector } from 'reselect';
import { ServerStatePayload, Room } from './types';

export interface SelectorFunction {
  (state: RootState): any;
}

export const getRoomById = (roomId: string) => (
  state: RootState
): Room | null => {
  const room = state.general.entities.rooms.byId[roomId];
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
