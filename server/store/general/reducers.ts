import {
  GeneralState,
  GeneralActionTypes,
  ADD_USER_TO_ROOM,
  REMOVE_USER_FROM_ROOM,
} from './types';
import { produce } from 'immer';
import { START_GAME_MESSAGE } from '../client/types';
import { GameType } from '../games/types';
import { createNewGame } from '../games';

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

export const generalReducer = (
  state = initialState,
  action: GeneralActionTypes
) => {
  switch (action.type) {
    case START_GAME_MESSAGE:
      const newGame = createNewGame(action.payload.gameType);

      return produce(state, draftState => {
        const roomId = action.meta.roomId;
        const room = draftState.entities.rooms.byId[roomId];

        room.game = newGame.id;

        draftState.entities.games.allIds.push(newGame.id);
        draftState.entities.games.byId[newGame.id] = newGame;
      });
      break;
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
