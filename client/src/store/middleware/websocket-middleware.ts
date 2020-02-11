import { MiddlewareAPI, Dispatch } from 'redux';
import io from 'socket.io-client';

import { CONNECT_TO_ROOM, SEND_MESSAGE } from 'store/websocket/types';
import { ActionTypes, ClientState, SET_USER } from 'store/types';
import { setClientState, setUser } from 'store/actions';
import { ServerStatePayload, User } from '@server/store/general/types';

const LOCAL_STORAGE_USER_ID_KEY = 'birdbrain__user_id';

const websocketMiddleware = () => {
  let socket: SocketIOClient.Socket;

  const onConnect = (store: MiddlewareAPI, roomId: string) => () => {
    console.log(`Successfully connected to room '${roomId}'!`);
  };

  const onClientStateUpdate = (store: MiddlewareAPI) => (
    data: ServerStatePayload
  ) => {
    store.dispatch(setClientState(data));
  };

  const onClientUserInfo = (store: MiddlewareAPI) => (user: User) => {
    store.dispatch(setUser(user));
  };

  return (store: MiddlewareAPI<Dispatch, ClientState>) => (next: Dispatch) => (
    action: ActionTypes
  ) => {
    switch (action.type) {
      case SET_USER: {
        localStorage.setItem(LOCAL_STORAGE_USER_ID_KEY, action.payload.user.id);
        next(action);
        break;
      }
      case CONNECT_TO_ROOM: {
        const { roomId, name } = action.payload;

        const devUrl = 'http://localhost:8080';
        const prodUrl = '/';
        const url = process.env.REACT_APP_EXTERNAL_CLIENT ? devUrl : prodUrl;

        console.log(`Connecting to room ${roomId} at url ${url}...`);

        const existingUserId = localStorage.getItem(LOCAL_STORAGE_USER_ID_KEY);

        const query: { [key: string]: string } = { roomId, name };
        if (existingUserId) {
          query.userId = existingUserId;
        }

        socket = io.connect(url, { query });

        socket.on('connect', onConnect(store, roomId));
        socket.on('client-state-update', onClientStateUpdate(store));
        socket.on('client-user-info', onClientUserInfo(store));

        break;
      }
      case SEND_MESSAGE: {
        const roomId = store.getState().room?.id;
        const userId = store.getState().user?.id;

        socket.emit('client-message', {
          ...action.payload,
          meta: {
            roomId,
            userId,
          },
        });
        break;
      }
      default:
        return next(action);
    }
  };
};

export default websocketMiddleware();
