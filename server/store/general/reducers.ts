import {
  GeneralState,
  GeneralActionTypes,
  ADD_USER_TO_ROOM,
  REMOVE_USER_FROM_ROOM,
} from './types';
import { produce } from 'immer';

const initialState: GeneralState = {
  rooms: [
    {
      id: 'nu',
      users: [],
    },
  ],
};

export const generalReducer = (
  state = initialState,
  action: GeneralActionTypes
) => {
  switch (action.type) {
    case ADD_USER_TO_ROOM:
      return produce(state, draftState => {
        const roomIndex = draftState.rooms.findIndex(
          room => room.id === action.payload.room.id
        );

        if (roomIndex > -1) {
          draftState.rooms[roomIndex].users.push(action.payload.user);
        }
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
