import { ClientState } from './types';
import { createSelector } from 'reselect';
import { User } from '@server/store/general/types';

export const getUserById = (userId: string) =>
  createSelector(
    (state: ClientState) => state.usersInRoom,
    usersInRoom => usersInRoom.find(user => user.id === userId)
  );

export const getIsRoomLeader = () => (state: ClientState) => {
  if (!state.user) {
    return false;
  }

  return state.user.id === state.room?.leaderUserID;
};

export const getRoomLeaderId = () => (state: ClientState): string | null => {
  const roomLeaderId = state.room?.leaderUserID;

  if (!roomLeaderId) {
    return null;
  }

  return roomLeaderId;
};

export const getRoomLeader = () =>
  createSelector(
    getRoomLeaderId(),
    getUsersInRoom(),
    (roomLeaderId, usersInRoom): User | null => {
      if (!roomLeaderId) {
        return null;
      }

      const roomLeader = usersInRoom.find(user => user.id === roomLeaderId);

      if (!roomLeader) {
        return null;
      }

      return roomLeader;
    }
  );

export const getUsersInRoom = () =>
  createSelector(
    (state: ClientState) => state.usersInRoom,
    usersInRoom => usersInRoom
  );

export const getGame = () =>
  createSelector(
    (state: ClientState) => state.game,
    game => game
  );
