import io from 'socket.io';
import {
  addUserToRoom,
  removeUserFromRoom,
  receivedClientMessage,
} from './store/general/actions';
import { User } from './store/general/types';
import { ClientMessageWithMeta } from './store/client/types';
import { getRoomById, getClientStateByRoomId } from './store/general/selectors';
import { Store } from './store';

const getSocketRoomId = (roomId: string) => {
  return `room:${roomId}`;
};

class SocketManager {
  public socketServer: io.Server;

  constructor(sockerServer: io.Server) {
    this.socketServer = sockerServer;
  }
}

/** 

example sequence might be:

client sends websocket message to server saying "in my current room, i just took
the following action with the following data"

with that message, the server resolves it against its entire state. this could include
changing the current game state (most likely) or changing the room state (like renaming the user)

after resolving it, the server emits the new current state to all users in the affected room

**/

const attachSocketListeners = (socketServer: io.Server, store: Store): void => {
  socketServer.on('connection', connectedSocket => {
    const {
      roomId,
      name,
    }: { roomId: string; name: string } = connectedSocket.handshake.query;

    const room = store.select(getRoomById(roomId));
    const user = new User(name);

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

      socketServer
        .to(getSocketRoomId(roomId))
        .emit(
          'client-state-update',
          store.select(getClientStateByRoomId(roomId))
        );
    }

    connectedSocket.on('client-message', (data: ClientMessageWithMeta) => {
      store.dispatch(receivedClientMessage(data));
    });

    connectedSocket.on('disconnect', () => {
      socketServer
        .to(getSocketRoomId(roomId))
        .emit('join-or-leave-messages', `${name} left the server!`);

      store.dispatch(removeUserFromRoom(room, user));

      // TODO find some way to "hook" into this event so that we can
      // emit this kind of state update whenever anything important happens
      socketServer
        .to(getSocketRoomId(roomId))
        .emit(
          'client-state-update',
          store.select(getClientStateByRoomId(roomId))
        );
    });
  });
};

export default attachSocketListeners;
