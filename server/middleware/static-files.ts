import express, { NextFunction, Request, Response, Router } from 'express';
import path from 'path';

const router = Router();

const pathToClientBuildDir = path.resolve(__dirname, '../../client/build/');

router.use(
  '/static',
  express.static(path.join(pathToClientBuildDir, '/static'))
);

router.use(
  '/favicon.ico',
  express.static(path.join(pathToClientBuildDir, '/favicon.ico'))
);

router.use(
  '/favicon-32x32.png',
  express.static(path.join(pathToClientBuildDir, '/favicon-32x32.png'))
);

router.use(
  '/favicon-64x64.png',
  express.static(path.join(pathToClientBuildDir, '/favicon-64x64.png'))
);

router.use(
  '/site.webmanifest',
  express.static(path.join(pathToClientBuildDir, '/site.webmanifest'))
);

router.use(
  '/apple-touch-icon.png',
  express.static(path.join(pathToClientBuildDir, '/apple-touch-icon.png'))
);

router.use(
  '/safari-pinned-tab.svg',
  express.static(path.join(pathToClientBuildDir, '/safari-pinned-tab.svg'))
);

export default router;
