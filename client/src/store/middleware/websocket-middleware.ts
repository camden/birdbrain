import { MiddlewareAPI, Dispatch } from 'redux';
import io from 'socket.io-client';

import { CONNECT_TO_ROOM } from 'store/websocket/types';
import { ActionTypes } from 'store/types';
import { setClientState } from 'store/actions';
import { ClientStatePayload } from '@server/store/general/types';

const websocketMiddleware = () => {
  let socket: SocketIOClient.Socket;

  const onConnect = (store: MiddlewareAPI, roomId: string) => () => {
    console.log(`Successfully connected to room '${roomId}'!`);
  };

  const onClientStateUpdate = (store: MiddlewareAPI) => (
    data: ClientStatePayload
  ) => {
    store.dispatch(setClientState(data));
  };

  return (store: MiddlewareAPI) => (next: Dispatch) => (
    action: ActionTypes
  ) => {
    switch (action.type) {
      case CONNECT_TO_ROOM:
        const { roomId, name } = action.payload;

        const devUrl = 'http://localhost:8080';
        const prodUrl = '/';
        const url = process.env.REACT_APP_EXTERNAL_CLIENT ? devUrl : prodUrl;

        console.log(`Connecting to room ${roomId} at url ${url}...`);

        socket = io.connect(url, {
          query: { roomId, name },
        });

        socket.on('connect', onConnect(store, roomId));
        socket.on('client-state-update', onClientStateUpdate(store));
        break;
      default:
        return next(action);
    }
  };
};

export default websocketMiddleware();
