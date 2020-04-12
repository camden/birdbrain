import React, { useCallback } from 'react';
import { PongGameState } from '@server/store/games/pong/types';
import styles from './Main.module.css';
import { Stage, Layer, Rect, Line } from 'react-konva';
import { useDispatch } from 'react-redux';
import { sendMessage } from 'store/websocket/actions';
import { pongUpdatePosition } from '@server/store/games/pong/actions';
import { KonvaEventObject } from 'konva/types/Node';

export interface PongMainProps {
  game: PongGameState;
}

const PongMain: React.FC<PongMainProps> = ({ game }) => {
  const dispatch = useDispatch();

  const { x, y } = game.players[0].position;

  const onMouseMove = useCallback((evt: KonvaEventObject<MouseEvent>) => {
    const { x, y } = evt.evt;
    dispatch(sendMessage(pongUpdatePosition(x, y)));
  }, []);

  return (
    <div>
      <h1>pong</h1>
      <Stage width={window.innerWidth} height={300} onMouseMove={onMouseMove}>
        <Layer>
          <Rect width={10} height={10} fill={'blue'} x={x} y={y} />
        </Layer>
      </Stage>
    </div>
  );
};

export default PongMain;
