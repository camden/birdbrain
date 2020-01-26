import express, { Application } from 'express';
import path from 'path';
import http from 'http';
import io from 'socket.io';
import * as Sentry from '@sentry/node';

import APIRoutes from './routes/api';
import staticFilesMiddleware from './middleware/static-files';
import errorHandlerMiddleware from './middleware/error-handler';
import { getRoomInfo } from './model/room';

class App {
  public app: Application;

  private httpServer: http.Server;

  constructor() {
    this.app = express();

    this.httpServer = http.createServer(this.app);

    if (process.env.NODE_ENV === 'production') {
      this.initializeSentry();
    }

    this.initializeSocketIO();
    this.initializeMiddleware();
  }

  public listen() {
    this.httpServer.listen(process.env.PORT || 3000, function() {
      console.log(
        `Birdbrain Games is listening on port ${process.env.PORT || 3000}!`
      );
    });
  }

  private initializeSentry() {
    console.log('Initializing Sentry');
    Sentry.init({
      dsn: 'https://e255af3258264012993bef70994eb2eb@sentry.io/1967305',
    });
    this.app.use(Sentry.Handlers.requestHandler());
    this.app.use(Sentry.Handlers.errorHandler());
  }

  private initializeSocketIO() {
    const socketServer = io(this.httpServer);

    socketServer.on('connection', socket => {
      const roomId = socket.handshake.query.roomId;
      const room = getRoomInfo(roomId);
      if (!room) {
        socket.disconnect();
      } else {
        socket.join(roomId);
        socket.emit('joined', 'Cam joined the server!');
      }
    });
  }

  private initializeMiddleware() {
    this.app.use(express.json());

    this.app.use('/', staticFilesMiddleware);

    this.app.use('/api', APIRoutes);

    this.app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, '../client/build/index.html'));
    });

    this.app.use(errorHandlerMiddleware);
  }
}

export default App;
