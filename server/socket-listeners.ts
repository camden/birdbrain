import io from 'socket.io';
import {
  addUserToRoom,
  removeUserFromRoom,
  receivedClientMessage,
} from './store/general/actions';
import { User } from './store/general/types';
import { ClientMessageWithMeta } from './store/client/types';
import { getRoomById } from './store/general/selectors';
import { Store } from './store';

const getSocketRoomId = (roomId: string) => {
  return `room:${roomId}`;
};

const attachSocketListeners = (socketServer: io.Server, store: Store): void => {
  socketServer.on('connection', connectedSocket => {
    const {
      roomId,
      name,
      userId,
    }: {
      roomId: string;
      name: string;
      userId?: string;
    } = connectedSocket.handshake.query;

    const room = store.select(getRoomById(roomId));
    const user = new User(name, userId);

    if (!room) {
      connectedSocket.disconnect();
    } else {
      connectedSocket.join(getSocketRoomId(roomId));

      store.dispatch(addUserToRoom(room, user));

      socketServer
        .to(getSocketRoomId(roomId))
        .emit('join-or-leave-messages', `${name} joined the server!`);

      // let this specific client know what its user info is
      connectedSocket.emit('client-user-info', user);
    }

    connectedSocket.on('client-message', (data: ClientMessageWithMeta) => {
      store.dispatch(receivedClientMessage(data));
    });

    connectedSocket.on('disconnect', () => {
      socketServer
        .to(getSocketRoomId(roomId))
        .emit('join-or-leave-messages', `${name} left the server!`);

      store.dispatch(removeUserFromRoom(room, user));
    });
  });
};

export default attachSocketListeners;
