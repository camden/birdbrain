import { GeneralState } from './types';
import { RootState } from '..';

export interface SelectorFunction {
  (state: RootState): any;
}

export const getAllRooms = (state: RootState) => state.general.rooms;

export const getRoomById = (roomId: string) => (state: RootState) => {
  return state.general.rooms.find(room => room.id === roomId);
};
