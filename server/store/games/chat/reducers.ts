import { ChatGameState } from './types';
import { ChatActionTypes, CHAT_SEND_MESSAGE } from './actions';
import produce from 'immer';

export const chatReducer = (
  game: ChatGameState,
  action: ChatActionTypes
): ChatGameState => {
  switch (action.type) {
    case CHAT_SEND_MESSAGE:
      const newMessage = action.payload;

      return produce(game, draftState => {
        draftState.messages.push(newMessage);
      });
  }
};
