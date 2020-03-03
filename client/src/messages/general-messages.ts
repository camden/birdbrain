import { sendMessage } from 'store/websocket/actions';
import { GameType } from '@server/store/games/types';
import {
  START_GAME_MESSAGE,
  PICK_GAME_TYPE_MESSAGE,
} from '@server/store/client/types';

export const sendStartGame = () =>
  sendMessage({
    type: START_GAME_MESSAGE,
    payload: {
      gameType: GameType.THE_RESISTANCE,
    },
  });

export const sendPickGame = (gameType: GameType) =>
  sendMessage({
    type: PICK_GAME_TYPE_MESSAGE,
    payload: {
      gameType,
    },
  });
