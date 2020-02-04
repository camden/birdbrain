import { sendMessage } from 'store/websocket/actions';

export const sendStartGame = () =>
  sendMessage({
    type: 'START_GAME_MESSAGE',
    payload: { ignoreMinUsers: true },
  });
