import React, { useCallback, useState } from 'react';
import { PongGameState } from '@server/store/games/pong/types';
import styles from './Main.module.css';
import { Stage, Layer, Rect, Line, Circle } from 'react-konva';
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

  const [curPlayerPos, setCurPlayerPos] = useState({ x: 0, y: 0 });

  const otherPlayers = game.players.filter(
    (p) => p.userId !== currentPlayer.userId
  );

  console.log(otherPlayers);

  const throttledSendUpdate = useCallback(
    throttle(100, (evt: KonvaEventObject<MouseEvent>) => {
      const { x, y } = evt.evt;
      dispatch(sendMessage(pongUpdatePosition(x, y)));
    }),
    []
  );
  const onMouseMove = useCallback(
    (evt: KonvaEventObject<MouseEvent>) => {
      throttledSendUpdate(evt);
      const { x, y } = evt.evt;
      setCurPlayerPos({ x, y });
    },
    [throttledSendUpdate]
  );

  const WIDTH = window.innerWidth;
  const HEIGHT = 300;

  return (
    <div>
      <Stage width={WIDTH} height={HEIGHT} onMouseMove={onMouseMove}>
        <Layer>
          <Rect x={0} y={0} width={WIDTH} height={HEIGHT} fill={'white'} />
        </Layer>
        <Layer>
          <Circle
            radius={16}
            fill={stringToColor(currentPlayer.name)}
            x={curPlayerPos.x}
            y={curPlayerPos.y}
          />
          {otherPlayers.map((p) => (
            <Circle
              key={p.userId}
              radius={16}
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
