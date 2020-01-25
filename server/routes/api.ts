import express from 'express';

const router = express.Router();

router
  .route('/room')
  .get((req, res, next) => {
    next(Error('not implemented'));
  })
  .post((req, res) => {
    res.send('got a room');
  });

export default router;
