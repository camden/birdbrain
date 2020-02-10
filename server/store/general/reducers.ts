import {
  GeneralState,
  GeneralActionTypes,
  ADD_USER_TO_ROOM,
  REMOVE_USER_FROM_ROOM,
  RoomID,
  Room,
} from './types';
import { produce } from 'immer';
import { START_GAME_MESSAGE } from '../client/types';
import { GameType } from '../games/types';
import { createNewGame } from '../games';
import { resistanceReducer } from '../games/the-resistance/reducers';
import { ResistanceGameState } from '../games/the-resistance/types';
import { ResistanceActionTypes } from '../games/the-resistance/actions';

const initialState: GeneralState = {
  entities: {
    rooms: {
      byId: {
        nu: {
          id: 'nu',
          users: [],
          leaderUserID: null,
          game: null,
        },
      },
      allIds: ['nu'],
    },
    users: {
      byId: {},
      allIds: [],
    },
    games: {
      byId: {
        '101234-resistance': {
          id: '101234-resistance',
          type: GameType.THE_RESISTANCE,
        },
      },
      allIds: ['101234-resistance'],
    },
  },
};

const getRoomById = (roomId: RoomID, state: GeneralState): Room | null => {
  return state.entities.rooms.byId[roomId] || null;
};

export const generalReducer = (
  state = initialState,
  action: GeneralActionTypes
) => {
  if (action.type.startsWith('RST_')) {
    const roomId = action.meta?.roomId;
    if (!roomId) {
      return state;
    }

    const room = getRoomById(roomId, state);
    const gameId = room?.game;
    if (!gameId) {
      return state;
    }
    return produce(state, draftState => {
      const game = draftState.entities.games.byId[gameId];
      if (!game) {
        return;
      }

      const updatedGame = resistanceReducer(
        game as ResistanceGameState,
        action as ResistanceActionTypes
      );

      draftState.entities.games.byId[gameId] = updatedGame;
    });
  }

  switch (action.type) {
    case START_GAME_MESSAGE:
      const roomId = action.meta?.roomId;

      if (!roomId) {
        return state;
      }

      const room = state.entities.rooms.byId[roomId];
      const usersInRoom = room.users.map(
        userId => state.entities.users.byId[userId]
      );
      const newGame = createNewGame(action.payload.gameType, usersInRoom);

      return produce(state, draftState => {
        const room = draftState.entities.rooms.byId[roomId];

        room.game = newGame.id;

        draftState.entities.games.allIds.push(newGame.id);
        draftState.entities.games.byId[newGame.id] = newGame;
      });
    case ADD_USER_TO_ROOM:
      return produce(state, draftState => {
        const room = draftState.entities.rooms.byId[action.payload.room.id];
        const newUser = action.payload.user;

        if (!room) {
          return;
        }

        if (room.users.length === 0) {
          room.leaderUserID = newUser.id;
        }

        room.users.push(newUser.id);
        draftState.entities.users.allIds.push(newUser.id);
        draftState.entities.users.byId[newUser.id] = newUser;
      });
    case REMOVE_USER_FROM_ROOM:
      return produce(state, draftState => {
        const room = draftState.entities.rooms.byId[action.payload.room.id];
        const userToRemove = action.payload.user;

        if (!room) {
          return;
        }

        room.users = room.users.filter(id => id !== userToRemove.id);

        draftState.entities.users.allIds = draftState.entities.users.allIds.filter(
          id => id !== userToRemove.id
        );

        delete draftState.entities.users.byId[userToRemove.id];
      });
    default:
      return state;
  }
};
