import {
  GeneralState,
  GeneralActionTypes,
  ADD_USER_TO_ROOM,
  REMOVE_USER_FROM_ROOM,
  RECEIVED_CLIENT_MESSAGE,
} from './types';
import { produce } from 'immer';
import { START_GAME_MESSAGE } from '../client/types';

const initialState: GeneralState = {
  rooms: [
    {
      id: 'nu',
      users: [],
      leaderUserID: null,
      game: null,
    },
  ],
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
        const roomIndex = draftState.rooms.findIndex(
          room => room.id === action.payload.room.id
        );

        const roomExists = roomIndex > -1;

        if (!roomExists) {
          return;
        }

        const room = draftState.rooms[roomIndex];

        if (room.users.length === 0) {
          room.leaderUserID = action.payload.user.id;
        }

        room.users.push(action.payload.user);
      });
    case REMOVE_USER_FROM_ROOM:
      return produce(state, draftState => {
        const roomIndex = draftState.rooms.findIndex(
          room => room.id === action.payload.room.id
        );

        if (roomIndex > -1) {
          const userIndex = draftState.rooms[roomIndex].users.findIndex(
            user => user.id === action.payload.user.id
          );

          draftState.rooms[roomIndex].users.splice(userIndex, 1);
        }
      });
    default:
      return state;
  }
};
