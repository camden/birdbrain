import express, { Router } from 'express';
import HttpException from '../exceptions/http-exception';
import { getRoomById } from '../store/general/selectors';
import { Store } from '../store';
import { createNewRoom } from 'store/general/actions';
import generateRoomId from 'utils/generate-room-id';

const APIRouter = (store: Store): Router => {
  const router = express.Router();

  router.route('/room').post((req, res, next) => {
    const roomId = generateRoomId();
    store.dispatch(createNewRoom(roomId));
    res.send({
      roomId,
    });
  });

  router
    .route('/room/:id')
    .get((req, res, next) => {
      const roomId = req.params.id;
      const room = store.select(getRoomById(roomId));

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
