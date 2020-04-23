import express, { Application } from 'express';
import path from 'path';
import http from 'http';
import https from 'https';
import io from 'socket.io';
import compression from 'compression';
import * as Sentry from '@sentry/node';

import { log } from './utils/log';
import APIRoutes from './routes/api';
import { Store } from './store';
import staticFilesMiddleware from './middleware/static-files';
import errorHandlerMiddleware from './middleware/error-handler';
import attachSocketListeners from './socket-listeners';
import fs from 'fs';

const USE_DEV_HTTPS = false;

class App {
  public app: Application;
  public store: Store;

  private server: http.Server | https.Server;

  constructor() {
    this.app = express();

    if (process.env.NODE_ENV === 'development' && USE_DEV_HTTPS) {
      const options = {
        key: fs.readFileSync(
          path.join(__dirname, '../localhost+2-key.pem'),
          'utf8'
        ),
        cert: fs.readFileSync(
          path.join(__dirname, '../localhost+2.pem'),
          'utf8'
        ),
        requestCert: false,
        rejectUnauthorized: false,
      };

      log('Creating https server...');
      this.server = https.createServer(options, this.app);
    } else {
      log('Creating http server...');
      this.server = http.createServer(this.app);
    }

    if (process.env.NODE_ENV === 'production') {
      this.initializeSentry();
    }

    const socketServer = io(this.server);
    this.store = new Store(socketServer);
    attachSocketListeners(socketServer, this.store);

    this.initializeMiddleware();
    this.app.use(Sentry.Handlers.errorHandler());
  }

  public listen() {
    this.server.listen(process.env.PORT || 8080, function () {
      log(
        `Birdbrain Games server is listening on port ${
          process.env.PORT || 8080
        }!`
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
    this.app.use(compression());
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
