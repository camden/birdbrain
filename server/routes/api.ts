import express from 'express';
import HttpException from '../exceptions/http-exception';
import { getRoomInfo } from '../model/room';

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
    const room = getRoomInfo(roomId);

    if (room) {
      res.send(room);
    } else {
      next(new HttpException(404, `Room '${roomId}' does not exist.`));
    }
  })
  .post((req, res, next) => {
    next(Error('not implemented'));
  });

export default router;
