import { RootState } from '..';
import { createSelector } from 'reselect';
import { ServerStatePayload, Room } from './types';
import { Game } from '../games/types';

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

// TODO memoize
export const getUsersInRoom = (roomId: string) => (state: RootState) => {
  const room = getRoomById(roomId)(state);

  if (!room) {
    return [];
  }

  return room.users.map(userId => state.general.entities.users.byId[userId]);
};

export const getGame = (roomId: string) =>
  createSelector(
    (state: RootState) => state.general.entities.games.byId,
    (state: RootState) => state.general.entities.rooms.byId,
    (gamesById, roomsById): Game | null => {
      const gameId = roomsById[roomId].game;
      if (!gameId) {
        return null;
      }

      return gamesById[gameId];
    }
  );

export const getClientStateByRoomId = (roomId: string) =>
  createSelector(
    getRoomById(roomId),
    getUsersInRoom(roomId),
    getGame(roomId),
    (room, usersInRoom, game): ServerStatePayload => ({
      room,
      usersInRoom,
      game,
    })
  );
