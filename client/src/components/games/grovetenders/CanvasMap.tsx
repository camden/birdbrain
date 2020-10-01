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
import ReactNipple from 'react-nipple';
import GameLoop from './GameLoop';

export interface GroveMapProps {
  game: GroveGameState;
}

export interface InputInfo {
  isMoving: boolean;
  angle: number;
  distance: number;
}

const GroveMap: React.FC<GroveMapProps> = ({ game }) => {
  const currentPlayer = useCurrentPlayer(game);
  const [stageWidth, setStageWidth] = useState(100);
  const containerRef = useRef<HTMLDivElement>(null);
  const [inputInfo, setInputInfo] = useState<InputInfo>({
    isMoving: false,
    angle: 0,
    distance: 0,
  });

  const checkSize = () => {
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

  return (
    <div>
      <div ref={containerRef} className={styles.wrapper}>
        IsMoving? {inputInfo.isMoving ? 'yes' : 'no'}
        <GameLoop
          game={game}
          canvasWidth={100}
          canvasHeight={100}
          inputInfo={inputInfo}
        />
      </div>
      <ReactNipple
        className={styles.joystick}
        options={{ mode: 'static', position: { top: '50%', left: '50%' } }}
        onMove={(evt: any, data: any) => {
          setInputInfo({
            isMoving: true,
            distance: data.distance,
            angle: data.angle.degree,
          });
        }}
        onEnd={() => {
          setInputInfo({
            isMoving: false,
            distance: 0,
            angle: 0,
          });
        }}
      />
    </div>
  );
};

export default GroveMap;
