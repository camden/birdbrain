import { RootState } from '..';
import { createSelector } from 'reselect';

export interface SelectorFunction {
  (state: RootState): any;
}

export const getAllRooms = (state: RootState) => state.general.rooms;

export const getRoomById = (roomId: string) => (state: RootState) => {
  return state.general.rooms.find(room => room.id === roomId);
};

export const getUsersInRoom = (roomId: string) =>
  createSelector(getRoomById(roomId), room => {
    return room?.users;
  });
