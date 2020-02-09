import { sendMessage } from 'store/websocket/actions';
import { GameID } from '@server/store/games/types';
import { START_GAME_MESSAGE, ClientMessage } from '@server/store/client/types';

export const sendStartGame = () =>
  sendMessage({
    type: START_GAME_MESSAGE,
    payload: {
      gameType: GameID.THE_RESISTANCE,
    },
  });
