import io from 'socket.io';
import App from './app';
import { addUserToRoom, removeUserFromRoom } from './store/general/actions';
import { User } from './store/general/types';
import { getRoomById, getUsersInRoom } from './store/general/selectors';
import { Store } from './store';

const getSocketRoomId = (roomId: string) => {
  return `room:${roomId}`;
};

const attachSocketListeners = (socketServer: io.Server, store: Store): void => {
  socketServer.on('connection', socket => {
    const {
      roomId,
      name,
    }: { roomId: string; name: string } = socket.handshake.query;

    console.log(`${name} connected`);

    const room = store.select(getRoomById(roomId));
    const user = new User(name);

    if (!room) {
      socket.disconnect();
    } else {
      socket.join(getSocketRoomId(roomId));

      store.dispatch(addUserToRoom(room, user));

      socketServer
        .to(getSocketRoomId(roomId))
        .emit('join-or-leave-messages', `${name} joined the server!`);

      socketServer
        .to(getSocketRoomId(roomId))
        .emit('users-in-room', store.select(getUsersInRoom(roomId)));
    }

    socket.on('disconnect', () => {
      console.log(`${name} disconnected`);

      socketServer
        .to(getSocketRoomId(roomId))
        .emit('join-or-leave-messages', `${name} left the server!`);

      store.dispatch(removeUserFromRoom(room, user));

      // TODO find some way to "hook" into this event so that we can
      // emit this kind of state update whenever anything important happens
      socketServer
        .to(getSocketRoomId(roomId))
        .emit('users-in-room', store.select(getUsersInRoom(roomId)));
    });
  });
};

export default attachSocketListeners;
