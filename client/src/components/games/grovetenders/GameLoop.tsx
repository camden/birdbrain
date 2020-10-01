import React, { useEffect, useState, useRef } from 'react';
import { GroveGameState } from '@server/store/games/grovetenders/types';
import { Stage, Layer, Circle } from 'react-konva';
import styles from './GameLoop.module.css';
import { InputInfo } from './CanvasMap';

export interface GameLoopProps {
  game: GroveGameState;
  canvasWidth: number;
  canvasHeight: number;
  inputInfo: InputInfo;
}

const HEIGHT_RATIO = 0.66;

const GameLoop: React.FC<GameLoopProps> = ({
  game,
  canvasWidth,
  canvasHeight,
  inputInfo,
}) => {
  const animFrame = useRef<number>(0);
  const counter = useRef<number>(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const update = (dt: number) => {
    if (inputInfo.isMoving) {
      console.log(inputInfo.isMoving);
      counter.current += 1;
    }

    const context = canvasRef.current?.getContext('2d');
    if (context && canvasRef.current) {
      draw(context, canvasRef.current.width, canvasRef.current.height);
    }

    // requestAnimationFrame(update);
  };

  useEffect(() => {
    animFrame.current = requestAnimationFrame(update);
    if (canvasRef.current) {
      canvasRef.current.height = HEIGHT_RATIO * canvasRef.current.width;
    }

    return () => {
      cancelAnimationFrame(animFrame.current);
    };
  }, []);

  const draw = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ) => {
    // clear
    ctx.clearRect(0, 0, width, height);

    // draw bg
    ctx.fillStyle = 'lightsalmon';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = 'red';
    ctx.fillText('hello', 10, 10);
    ctx.fillText(`count: ${counter.current}`, 10, 20);
  };

  return (
    <div>
      <canvas ref={canvasRef} className={styles.mainCanvas} />
    </div>
  );
};

export default GameLoop;
