import { sendMessage } from 'store/websocket/actions';
import { chatSendMessage as sendMessageActionCreator } from '@server/store/games/chat/actions';
import { UserID } from '@server/store/general/types';

export const sendChatMessage = (text: string, author: UserID) =>
  sendMessage(sendMessageActionCreator(text, author));
