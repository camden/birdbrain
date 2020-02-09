import { MiddlewareAPI, Dispatch } from 'redux';
import { GeneralActionTypes, RoomID } from '../general/types';
import { RootState } from '..';
import { START_GAME_MESSAGE } from '../client/types';
import { getClientStateByRoomId } from '../general/selectors';

const getSocketRoomId = (roomId: string) => {
  return `room:${roomId}`;
};

const socketMiddleware = () => (socketServer: SocketIO.Server) => {
  const sendClientUpdate = (
    roomId: RoomID,
    store: MiddlewareAPI<Dispatch, RootState>
  ) => {
    const clientState = getClientStateByRoomId(roomId)(store.getState());

    socketServer
      .to(getSocketRoomId(roomId))
      .emit('client-state-update', clientState);
  };

  return (store: MiddlewareAPI<Dispatch, RootState>) => (next: Dispatch) => (
    action: GeneralActionTypes
  ) => {
    next(action);

    if (action.type === START_GAME_MESSAGE) {
      sendClientUpdate(action.meta.roomId, store);
    }
  };
};

export default socketMiddleware();
