import React, { useCallback } from 'react';
import { PongGameState } from '@server/store/games/pong/types';
import styles from './Main.module.css';
import { Stage, Layer, Rect, Line } from 'react-konva';
import { useDispatch } from 'react-redux';
import { sendMessage } from 'store/websocket/actions';
import { pongUpdatePosition } from '@server/store/games/pong/actions';
import { KonvaEventObject } from 'konva/types/Node';
import { useCurrentPlayer } from 'utils/pong-utils';
import stringToColor from 'string-to-color';
import { throttle } from 'throttle-debounce';

export interface PongMainProps {
  game: PongGameState;
}

const PongMain: React.FC<PongMainProps> = ({ game }) => {
  const dispatch = useDispatch();
  const currentPlayer = useCurrentPlayer(game);

  const otherPlayers = game.players.filter(
    (p) => p.userId !== currentPlayer.userId
  );

  console.log(otherPlayers);

  const onMouseMove = useCallback(
    throttle(100, (evt: KonvaEventObject<MouseEvent>) => {
      const { x, y } = evt.evt;
      dispatch(sendMessage(pongUpdatePosition(x, y)));
    }),
    []
  );

  return (
    <div>
      <h1>pong</h1>
      <Stage width={window.innerWidth} height={300} onMouseMove={onMouseMove}>
        <Layer>
          {otherPlayers.map((p) => (
            <Rect
              width={10}
              height={10}
              fill={stringToColor(p.name)}
              x={p.position.x}
              y={p.position.y}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default PongMain;
