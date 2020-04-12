import React, { useCallback, useState, useRef } from 'react';
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

  const throttledSendUpdate = useCallback(
    throttle(100, (x: number, y: number) => {
      dispatch(sendMessage(pongUpdatePosition(x, y)));
    }),
    []
  );

  const onMouseMove = useCallback(
    (evt: KonvaEventObject<MouseEvent> | KonvaEventObject<TouchEvent>) => {
      const pos = evt.currentTarget.getStage()?.getPointerPosition();
      if (!pos) {
        return;
      }

      const { x, y } = pos;

      throttledSendUpdate(x, y);
      setCurPlayerPos({ x, y });
    },
    [throttledSendUpdate]
  );

  const wrapperRef = useRef<HTMLDivElement>(null);

  const WIDTH = wrapperRef.current?.clientWidth;
  const HEIGHT = 300;

  return (
    <div ref={wrapperRef}>
      <Stage
        width={WIDTH || 10}
        height={HEIGHT}
        onMouseMove={onMouseMove}
        onTouchMove={onMouseMove}
        onTouchStart={onMouseMove}
        onTouchEnd={onMouseMove}
      >
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
