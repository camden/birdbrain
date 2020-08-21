import React, { useEffect, useState, useRef } from 'react';
import {
  GroveGameState,
  GrovePlayer,
} from '@server/store/games/grovetenders/types';
import styles from './CanvasMap.module.css';
import { useCurrentPlayer } from 'utils/grovetenders-utils';
import cx from 'classnames';
import Button from 'components/shared/button/Button';
import { Stage, Layer, Circle } from 'react-konva';

export interface GroveMapProps {
  game: GroveGameState;
}

export interface MapOccupant {
  player: GrovePlayer;
  type: 'active' | 'hidden' | 'previous';
}

const GroveMap: React.FC<GroveMapProps> = ({ game }) => {
  const currentPlayer = useCurrentPlayer(game);
  const [stageWidth, setStageWidth] = useState(100);
  const containerRef = useRef<HTMLDivElement>(null);

  const checkSize = () => {
    console.log('hi');
    const width = containerRef.current?.offsetWidth;
    if (width) {
      setStageWidth(width);
    }
  };

  useEffect(() => {
    checkSize();
    window.addEventListener('resize', checkSize);

    return function cleanup() {
      window.removeEventListener('resize', checkSize);
    };
  }, []);

  const circleRadius = 10;
  const cols = 3;
  const colWidth = stageWidth / cols;

  return (
    <div ref={containerRef} className={styles.wrapper}>
      <Stage width={stageWidth} height={100}>
        <Layer>
          <Circle
            x={circleRadius + 0.5 * colWidth}
            y={10}
            radius={circleRadius}
            fill="red"
          />
          <Circle
            x={colWidth * 1.5 + circleRadius}
            y={10}
            radius={circleRadius}
            fill="red"
          />
          <Circle
            x={colWidth * 2 + circleRadius}
            y={10}
            radius={circleRadius}
            fill="red"
          />
        </Layer>
      </Stage>
    </div>
  );
};

export interface PointProps {
  occupants: MapOccupant[];
}

const Point: React.FC<PointProps> = ({ occupants }) => {
  return (
    <Button className={styles.point} secondary>
      <div className={styles.inner}>
        {occupants.map((occupant) => (
          <div
            style={{
              color: occupant.player.color,
            }}
            className={cx(styles.player, {
              [styles.active]: occupant.type === 'active',
              [styles.previous]: occupant.type === 'previous',
            })}
          />
        ))}
      </div>
    </Button>
  );
};

export default GroveMap;
