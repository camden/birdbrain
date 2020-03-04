import { Game, GameType } from '../types';
import { UserID } from 'store/general/types';

export interface ChatGameState extends Game {
  type: GameType.CHAT;
  players: ChatPlayer[];
  messages: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  text: string;
  author: UserID;
}

export interface ChatPlayer {
  userId: string;
  name: string;
}
