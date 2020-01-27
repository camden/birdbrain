import io from 'socket.io';
import { getRoomInfo } from './model/room';

const attachSocketListeners = (socketServer: io.Server): void => {
  socketServer.on('connection', socket => {
    const {
      roomId,
      name,
    }: { roomId: string; name: string } = socket.handshake.query;

    const room = getRoomInfo(roomId);
    if (!room) {
      socket.disconnect();
    } else {
      socket.join(roomId);
      socket.emit('joined', `${name} joined the server!`);
    }
  });
};

export default attachSocketListeners;
