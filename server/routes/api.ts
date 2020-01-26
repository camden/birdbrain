import express from 'express';
import HttpException from '../exceptions/http-exception';

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

interface Room {
  id: string;
}

//TODO: pull this out and use some kind of persistence
const getRoomInfo = (roomId: string): Room | null => {
  if (roomId === 'nu') {
    return { id: 'nu' };
  } else {
    return null;
  }
};

export default router;
