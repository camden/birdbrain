import { sendMessage } from 'store/websocket/actions';
import { chatSendMessage as sendMessageActionCreator } from '@server/store/games/chat/actions';
import { User } from '@server/store/general/types';

export const sendChatMessage = (text: string, author: User) =>
  sendMessage(sendMessageActionCreator(text, author.id, author.name));
