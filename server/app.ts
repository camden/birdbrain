import express, { Application } from 'express';
import path from 'path';
import http from 'http';
import io from 'socket.io';
import Sentry from '@sentry/node';

import APIRoutes from './routes/api';
import staticFilesMiddleware from './middleware/static-files';

class App {
  public app: Application;

  private httpServer: http.Server;

  constructor() {
    this.app = express();

    this.httpServer = http.createServer(this.app);

    this.initializeSentry();
    this.initializeSocketIO();
    this.initializeMiddleware();
  }

  public listen() {
    this.httpServer.listen(process.env.PORT || 3000, function() {
      console.log(`Example app listening on port ${process.env.PORT || 3000}!`);
    });
  }

  private initializeSentry() {
    Sentry.init({
      dsn: 'https://e255af3258264012993bef70994eb2eb@sentry.io/1967305',
    });
    this.app.use(Sentry.Handlers.requestHandler);
  }

  private initializeSocketIO() {
    const socketServer = io(this.httpServer);

    socketServer.on('connection', socket => {
      console.log('a user connected!');
    });
  }

  private initializeMiddleware() {
    this.app.use('/', staticFilesMiddleware);

    this.app.use('/api', APIRoutes);

    this.app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, '../client/build/index.html'));
    });
  }
}

export default App;
