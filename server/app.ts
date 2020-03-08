import express, { Application } from 'express';
import path from 'path';
import http from 'http';
import io from 'socket.io';
import * as Sentry from '@sentry/node';

import { log } from './utils/log';
import APIRoutes from './routes/api';
import { Store } from './store';
import staticFilesMiddleware from './middleware/static-files';
import errorHandlerMiddleware from './middleware/error-handler';
import attachSocketListeners from './socket-listeners';

class App {
  public app: Application;
  public store: Store;

  private httpServer: http.Server;

  constructor() {
    this.app = express();

    this.httpServer = http.createServer(this.app);

    if (process.env.NODE_ENV === 'production') {
      this.initializeSentry();
    }

    const socketServer = io(this.httpServer);
    this.store = new Store(socketServer);
    attachSocketListeners(socketServer, this.store);

    this.initializeMiddleware();
    this.app.use(Sentry.Handlers.errorHandler());
  }

  public listen() {
    this.httpServer.listen(process.env.PORT || 8080, function() {
      log(
        `Birdbrain Games server is listening on port ${process.env.PORT ||
          8080}!`
      );
    });
  }

  private initializeSentry() {
    log('Initializing Sentry');
    Sentry.init({
      dsn: 'https://e255af3258264012993bef70994eb2eb@sentry.io/1967305',
    });
    this.app.use(Sentry.Handlers.requestHandler());
  }

  private initializeMiddleware() {
    this.app.use(express.json());

    if (process.env.NODE_ENV === 'production') {
      this.app.use((req, res, next) => {
        if (req.header('x-forwarded-proto') !== 'https') {
          res.redirect(`https://${req.header('host')}${req.url}`);
        } else {
          next();
        }
      });
    }

    this.app.use('/', staticFilesMiddleware);

    this.app.use('/api', APIRoutes(this.store));

    this.app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, '../client/build/index.html'));
    });

    this.app.use(errorHandlerMiddleware);
  }
}

export default App;
