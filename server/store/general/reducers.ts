import {
  GeneralState,
  GeneralActionTypes,
  ADD_USER_TO_ROOM,
  REMOVE_USER_FROM_ROOM,
  RoomID,
  Room,
  CREATE_NEW_ROOM,
} from './types';
import { produce } from 'immer';
import { START_GAME_MESSAGE, PICK_GAME_TYPE_MESSAGE } from '../client/types';
import { GameType } from '../games/types';
import { createNewGame } from '../games';
import { resistanceReducer } from '../games/the-resistance/reducers';
import { ResistanceGameState } from '../games/the-resistance/types';
import { ResistanceActionTypes } from '../games/the-resistance/actions';
import { ChatActionTypes } from 'store/games/chat/actions';
import { chatReducer } from 'store/games/chat/reducers';
import { ChatGameState } from 'store/games/chat/types';
import { pickRandomNumber } from 'utils/rng';

const initialState: GeneralState = {
  entities: {
    rooms: {
      byId: {
        NU: {
          id: 'NU',
          users: [],
          leaderUserID: null,
          game: null,
          selectedGameType: null,
        },
      },
      allIds: ['NU'],
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
  // TODO generalize game handling code
  if (action.type.startsWith('CHAT_')) {
    const chatAction = action as ChatActionTypes;
    const roomId = chatAction.meta?.roomId;
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

      const updatedGame = chatReducer(game as ChatGameState, chatAction);

      draftState.entities.games.byId[gameId] = updatedGame;
    });
  }

  if (action.type.startsWith('RST_')) {
    const resistanceAction = action as ResistanceActionTypes;
    const roomId = resistanceAction.meta?.roomId;
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
        resistanceAction
      );

      draftState.entities.games.byId[gameId] = updatedGame;
    });
  }

  switch (action.type) {
    case PICK_GAME_TYPE_MESSAGE:
      const roomId = action.meta.roomId;

      if (!roomId) {
        return state;
      }

      return produce(state, draftState => {
        const room = draftState.entities.rooms.byId[roomId];
        room.selectedGameType = action.payload.gameType;
      });
    case START_GAME_MESSAGE: {
      const roomId = action.meta.roomId;

      if (!roomId) {
        return state;
      }

      const room = state.entities.rooms.byId[roomId];

      if (!room.selectedGameType) {
        return state;
      }

      const usersInRoom = room.users.map(
        userId => state.entities.users.byId[userId]
      );
      const newGame = createNewGame(room.selectedGameType, usersInRoom);

      return produce(state, draftState => {
        const room = draftState.entities.rooms.byId[roomId];

        room.game = newGame.id;

        draftState.entities.games.allIds.push(newGame.id);
        draftState.entities.games.byId[newGame.id] = newGame;
      });
    }
    case CREATE_NEW_ROOM:
      return produce(state, draftState => {
        const newRoomId = action.payload.roomId;
        draftState.entities.rooms.allIds.push(newRoomId);

        draftState.entities.rooms.byId[newRoomId] = {
          id: newRoomId,
          game: null,
          leaderUserID: null,
          users: [],
          selectedGameType: null,
        };
      });
    case ADD_USER_TO_ROOM:
      return produce(state, draftState => {
        const room = draftState.entities.rooms.byId[action.payload.room.id];
        const newUser = action.payload.user;

        if (!room) {
          return;
        }

        const roomLeaderIsNotInRoom = room.users.every(
          userId => room.leaderUserID !== userId
        );

        if (room.users.length === 0 || roomLeaderIsNotInRoom) {
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

        // if user was leader, set a different user as the leader
        if (room.users.length > 0 && room.leaderUserID === userToRemove.id) {
          room.leaderUserID =
            room.users[pickRandomNumber(0, room.users.length)];
        }
      });
    default:
      return state;
  }
};
