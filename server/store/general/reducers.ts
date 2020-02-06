import {
  GeneralState,
  GeneralActionTypes,
  ADD_USER_TO_ROOM,
  REMOVE_USER_FROM_ROOM,
} from './types';
import { produce } from 'immer';
import { START_GAME_MESSAGE } from '../client/types';

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
  },
};

export const generalReducer = (
  state = initialState,
  action: GeneralActionTypes
) => {
  switch (action.type) {
    case START_GAME_MESSAGE:
      console.log(action);
      return state;
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
