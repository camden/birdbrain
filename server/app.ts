import express, { Application } from 'express';
import path from 'path';
import http from 'http';
import io from 'socket.io';
import { Store } from 'redux';
import * as Sentry from '@sentry/node';

import APIRoutes from './routes/api';
import { initializeStore } from './store';
import staticFilesMiddleware from './middleware/static-files';
import errorHandlerMiddleware from './middleware/error-handler';
import { GeneralState } from './store/general/types';
import attachSocketListeners from './socket-listeners';

class App {
  public app: Application;
  public store: Store;

  private httpServer: http.Server;

  constructor() {
    this.app = express();
    this.store = initializeStore();

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

    attachSocketListeners(socketServer, this);
  }

  private initializeMiddleware() {
    this.app.use(express.json());

    this.app.use('/', staticFilesMiddleware);

    this.app.use('/api', APIRoutes(this));

    this.app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, '../client/build/index.html'));
    });

    this.app.use(errorHandlerMiddleware);
  }
}

export default App;
