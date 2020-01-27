import { GeneralState } from './types';
import { RootState } from '..';

export const getRoomById = (roomId: string) => (state: RootState) => {
  return state.general.rooms.find(room => room.id === roomId);
};
