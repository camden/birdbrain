import React, { useRef, useEffect, useState } from 'react';
import { useTracker } from './useTracker';
import styles from './PingPong.module.css';
import Button from 'components/shared/button/Button';
import useInterval from 'use-interval';
import useSound from 'hooks/use-sound';
const PopSoundEffect = require('assets/sounds/pop_clicklo.wav');

export interface PingPongProps {}

export interface ScreenPosition {
  x: number;
  y: number;
}

export interface Vector2D {
  direction: number;
  magnitude: number;
}

const NUMBER_OF_RECENTS = 25;
const TABLE_EDGE_LEFT_OFFSET = 0;
const TABLE_EDGE_RIGHT_OFFSET = 0; //offset from left side of screen

const Ball: React.FC<{ loc: ScreenPosition }> = ({ loc }) => {
  const transform = `translateX(${loc.x}px) translateY(${loc.y}px)`;
  return (
    <div
      className={styles.ball}
      style={{
        transform,
      }}
    ></div>
  );
};

const PingPong: React.FC<PingPongProps> = () => {
  const playPopSound = useSound(PopSoundEffect);
  const canvasElement = useRef<HTMLCanvasElement>(null);
  const videoElement = useRef<HTMLVideoElement>(null);
  const [ballLocState, setBallLoc] = useState<ScreenPosition>({ x: 0, y: 0 });
  const ballLoc = useRef<ScreenPosition>({ x: 0, y: 0 });
  const ballVector = useRef<Vector2D>({ magnitude: 0, direction: 0 });
  const recentBallLocs = useRef<ScreenPosition[]>([{ x: 0, y: 0 }]);
  const getTolerance = () => {
    return 20;
  };

  useInterval(() => {
    const { direction, magnitude } = ballVector.current;
    const maybeWentOffscreenToTheRight =
      direction > 90 && direction < 110 && magnitude > 10;
    if (maybeWentOffscreenToTheRight) {
      playPopSound();
    }
    console.log(ballVector.current);
    // take average of y values
    // setBallLoc(ballLoc.current);
  }, 100);

  useTracker(
    '#video',
    () => videoElement.current,
    getTolerance,
    (event, tracker) => {
      if (!canvasElement.current) {
        return;
      }

      const ctx = canvasElement.current.getContext('2d');
      if (!ctx) {
        return;
      }

      const canvas = canvasElement.current;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // get all X values within range of first x value
      // and then average them
      if (event.data.length > 0) {
        const firstX = event.data[0].x;
        const firstY = event.data[0].y;

        const sumOfX = event.data
          .map((rect) => rect.x)
          .filter((x) => Math.abs(x - firstX) < 50)
          .reduce((acc, cur) => acc + cur, 0);
        const averageX = sumOfX / event.data.length;

        const sumOfY = event.data
          .map((rect) => rect.y)
          .filter((y) => Math.abs(y - firstY) < 50)
          .reduce((acc, cur) => acc + cur, 0);
        const averageY = sumOfY / event.data.length;

        const nextLoc = { x: averageX, y: averageY };
        ballLoc.current = nextLoc;
        const lastBallLoc =
          recentBallLocs.current[recentBallLocs.current.length - 1];
        if (lastBallLoc.x !== nextLoc.x) {
          recentBallLocs.current.unshift(nextLoc);
        }
        if (recentBallLocs.current.length > NUMBER_OF_RECENTS) {
          recentBallLocs.current.pop();
        }
      }

      // CALCULATE VECTORS
      if (recentBallLocs.current.length > 10) {
        const iterations = 4;
        const startIndex = 2;
        const vectors: Vector2D[] = [];
        for (let i = 1; i < iterations + startIndex; i++) {
          const a = recentBallLocs.current[i + 1];
          const b = recentBallLocs.current[i];

          const direction = Math.atan2(a.x - b.x, a.y - b.y);
          const magnitude = Math.hypot(a.x - b.x, a.y - b.y);

          const vec: Vector2D = {
            direction,
            magnitude,
          };
          vectors.push(vec);
        }

        let totalDir = 0;
        let totalMag = 0;
        for (let i = 0; i < vectors.length; i++) {
          const vec = vectors[i];
          totalDir += vec.direction;
          totalMag += vec.magnitude;
        }
        const avgDir = totalDir / vectors.length;
        const avgMag = totalMag / vectors.length;

        ballVector.current = {
          direction: avgDir,
          magnitude: avgMag,
        };
      }

      recentBallLocs.current.forEach((loc, index) => {
        if (index < 5) {
          ctx.strokeStyle = 'green';
        } else {
          ctx.strokeStyle = 'hotpink';
        }
        ctx.globalAlpha = 1 - index / Math.max(1, NUMBER_OF_RECENTS - 1);
        ctx.beginPath();
        ctx.arc(loc.x, loc.y, 10, 0, 2 * Math.PI);
        ctx.stroke();
      });
      ctx.globalAlpha = 1;

      //draw "compass"
      const compassOrigin: ScreenPosition = {
        x: 100,
        y: 100,
      };

      // const x1 = compassOrigin.x
      // const y1 = compassOrigin.y
      // ctx.moveTo(x1, y1);
      // ctx.lineTo(x1 + r * Math.cos(theta), y1 + r * Math.sin(theta));
      // ctx.stroke();

      event.data.forEach(function (rect, index) {
        if (rect.color === 'pingpong') {
          rect.color = 'hotpink';
        }

        ctx.strokeStyle = rect.color || 'transparent';
        ctx.lineWidth = 10;
        ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
        ctx.font = '11px Helvetica';
        ctx.fillStyle = '#fff';
        ctx.fillText(
          'x: ' + rect.x + 'px',
          rect.x + rect.width + 5,
          rect.y + 11
        );
        ctx.fillText(
          'y: ' + rect.y + 'px',
          rect.x + rect.width + 5,
          rect.y + 22
        );
      });
    }
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.videoWrapper}>
        <video
          ref={videoElement}
          id="video"
          width="600"
          height="450"
          autoPlay
          loop
          muted
          controls
        ></video>
        <canvas
          id="canvas"
          width="600"
          height="450"
          ref={canvasElement}
        ></canvas>
      </div>
      <Button onClick={() => (ballLoc.current = { x: 100, y: 100 })}>
        random ball position
      </Button>
    </div>
  );
};

export default PingPong;
