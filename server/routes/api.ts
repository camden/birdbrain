import express, { Router } from 'express';
import HttpException from '../exceptions/http-exception';
import { getRoomById } from '../store/general/selectors';
import App from '../app';

const APIRouter = (app: App): Router => {
  const router = express.Router();

  router
    .route('/room')
    .get((req, res, next) => {
      res.send({
        name: 'cam',
      });
    })
    .post((req, res, next) => {
      next(Error('not implemented'));
    });

  router
    .route('/room/:id')
    .get((req, res, next) => {
      const roomId = req.params.id;
      const room = getRoomById(roomId)(app.store.getState());

      if (room) {
        res.send(room);
      } else {
        next(new HttpException(404, `Room '${roomId}' does not exist.`));
      }
    })
    .post((req, res, next) => {
      next(Error('not implemented'));
    });

  return router;
};

export default APIRouter;
