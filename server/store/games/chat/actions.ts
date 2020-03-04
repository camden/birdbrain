import { UserID, ActionMeta } from 'store/general/types';
import uuid from 'uuid/v1';

export interface ChatBaseAction {
  meta: ActionMeta;
}

export const CHAT_SEND_MESSAGE = 'CHAT_SEND_MESSAGE';

export interface ChatSendMessageAction extends ChatBaseAction {
  type: typeof CHAT_SEND_MESSAGE;
  payload: {
    id: string;
    text: string;
    author: UserID;
  };
}

export const chatSendMessage = (text: string, author: UserID) => {
  const id = uuid();

  return {
    type: CHAT_SEND_MESSAGE,
    payload: {
      id,
      text,
      author,
    },
  };
};

export type ChatActionTypes = ChatSendMessageAction;
