import io from 'socket.io';
import App from './app';
import { addUserToRoom } from './store/general/actions';
import { User } from './store/general/types';
import { getRoomById } from './store/general/selectors';

const attachSocketListeners = (socketServer: io.Server, app: App): void => {
  socketServer.on('connection', socket => {
    const {
      roomId,
      name,
    }: { roomId: string; name: string } = socket.handshake.query;

    const room = getRoomById(roomId)(app.store.getState());

    if (!room) {
      socket.disconnect();
    } else {
      socket.join(roomId);

      app.store.dispatch(addUserToRoom(room, new User(name)));

      socket.emit('joined', `${name} joined the server!`);
    }
  });
};

export default attachSocketListeners;
