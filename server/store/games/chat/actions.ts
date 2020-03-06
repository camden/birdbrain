import { UserID, ActionMeta } from 'store/general/types';
import uuid from 'uuid/v1';

export interface ChatBaseAction {
  meta: ActionMeta;
}

export const CHAT_SEND_MESSAGE = 'CHAT_SEND_MESSAGE';

export interface ChatSendMessageAction {
  type: typeof CHAT_SEND_MESSAGE;
  payload: {
    id: string;
    text: string;
    authorId: UserID;
    authorName: string;
  };
}

export const chatSendMessage = (
  text: string,
  authorId: UserID,
  authorName: string
): ChatSendMessageAction => {
  const id = uuid();

  return {
    type: CHAT_SEND_MESSAGE,
    payload: {
      id,
      text,
      authorId,
      authorName,
    },
  };
};

export type ChatActionTypes = ChatSendMessageAction;
