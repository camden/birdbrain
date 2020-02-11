import express, { Router } from 'express';
import HttpException from '../exceptions/http-exception';
import { getRoomById } from '../store/general/selectors';
import { Store } from '../store';

const APIRouter = (store: Store): Router => {
  const router = express.Router();

  router.route('/room').get((req, res, next) => {
    next(Error('not implemented'));
  });

  router
    .route('/room/:id')
    .get((req, res, next) => {
      const roomId = req.params.id;
      const room = store.select(getRoomById(roomId));
      console.log('got room: ', room);

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
