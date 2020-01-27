import io from 'socket.io';
import App from './app';
import { addUserToRoom } from './store/general/actions';
import { User } from './store/general/types';
import { getRoomById } from './store/general/selectors';
import { Store } from './store';

const attachSocketListeners = (socketServer: io.Server, store: Store): void => {
  socketServer.on('connection', socket => {
    const {
      roomId,
      name,
    }: { roomId: string; name: string } = socket.handshake.query;

    const room = store.select(getRoomById(roomId));

    if (!room) {
      socket.disconnect();
    } else {
      socket.join(roomId);

      // app.store.dispatch(addUserToRoom(room, new User(name)));
      store.dispatch(addUserToRoom(room, new User(name)));

      socket.emit('joined', `${name} joined the server!`);
    }
  });
};

export default attachSocketListeners;
