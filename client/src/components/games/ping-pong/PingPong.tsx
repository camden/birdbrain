import React, { useRef, useEffect, useState } from 'react';
import { useTracker } from './useTracker';
import styles from './PingPong.module.css';
import Button from 'components/shared/button/Button';
import useInterval from 'use-interval';
import useSound from 'hooks/use-sound';
const ScoreSoundEffect = require('assets/sounds/chime_bell_ding.wav');

export interface PingPongProps {}

export interface ScreenPosition {
  x: number;
  y: number;
}

export interface Vector2D {
  direction: number;
  magnitude: number;
  points?: ScreenPosition[];
}

const HEIGHT = 450;
const WIDTH = 600;

const NUMBER_OF_RECENTS = 15;
const TABLE_EDGE_OFFSET_LEFT = 100;
const TABLE_EDGE_OFFSET_RIGHT = 100; //offset from left side of screen

export enum Team {
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}

const PingPong: React.FC<PingPongProps> = () => {
  const playPopSound = useSound(ScoreSoundEffect);
  const canvasElement = useRef<HTMLCanvasElement>(null);
  const videoElement = useRef<HTMLVideoElement>(null);
  const [ballLocState, setBallLoc] = useState<ScreenPosition>({ x: 0, y: 0 });
  const ballLoc = useRef<ScreenPosition>({ x: 0, y: 0 });
  const ballLastSeenTime = useRef<number>(0);
  const isBallActive = useRef<boolean>(false);
  const ballVector = useRef<Vector2D>({ magnitude: 0, direction: 0 });
  const recentBallLocs = useRef<ScreenPosition[]>([
    { x: 0, y: 0 },
    { x: 0, y: 0 },
  ]);
  const getTolerance = () => {
    return 20;
  };

  const handleScore = (team: Team) => {
    playPopSound();
    isBallActive.current = false;
    alert();
  };

  useInterval(() => {
    const { direction, magnitude } = ballVector.current;

    const timeSinceBallLastSeen = Date.now() - ballLastSeenTime.current;

    if (timeSinceBallLastSeen > 1000 && isBallActive) {
      const maybeWentOffscreenToTheLeft =
        direction < 0 &&
        ballLoc.current.x < TABLE_EDGE_OFFSET_LEFT &&
        magnitude > 10;

      if (maybeWentOffscreenToTheLeft) {
        handleScore(Team.LEFT);
        return;
      }

      const maybeWentOffscreenToTheRight =
        direction > 0 &&
        ballLoc.current.x < TABLE_EDGE_OFFSET_RIGHT &&
        magnitude > 10;

      if (maybeWentOffscreenToTheRight) {
        handleScore(Team.RIGHT);
        return;
      }
    }

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
          .filter((x) => Math.abs(x - firstX) < 100)
          .reduce((acc, cur) => acc + cur, 0);
        const averageX = sumOfX / event.data.length;

        const sumOfY = event.data
          .map((rect) => rect.y)
          .filter((y) => Math.abs(y - firstY) < 100)
          .reduce((acc, cur) => acc + cur, 0);
        const averageY = sumOfY / event.data.length;

        const nextLoc = { x: averageX, y: averageY };
        ballLoc.current = nextLoc;
        const lastBallLoc = recentBallLocs.current[1];
        if (lastBallLoc.x !== nextLoc.x && lastBallLoc.y !== nextLoc.y) {
          recentBallLocs.current.unshift(nextLoc);
          ballLastSeenTime.current = Date.now();
          isBallActive.current = true;
        }
        if (recentBallLocs.current.length > NUMBER_OF_RECENTS) {
          recentBallLocs.current.pop();
        }
      }

      // CALCULATE VECTORS
      if (recentBallLocs.current.length > 10) {
        const iterations = 8;
        const startIndex = 1;
        const vectors: Vector2D[] = [];
        for (let i = 1; i < iterations + startIndex; i++) {
          const a = recentBallLocs.current[i];
          const b = recentBallLocs.current[i + 1];

          let direction = (Math.atan2(a.y - b.y, a.x - b.x) * 180) / Math.PI; // degrees
          const magnitude = Math.hypot(a.x - b.x, a.y - b.y);

          const vec: Vector2D = {
            direction,
            magnitude,
            points: [a, b],
          };
          if (magnitude > 0) {
            vectors.push(vec);
          }
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

        ctx.font = '11px Helvetica';
        ctx.fillStyle = '#fff';
        ctx.fillText(`${loc.x}, ${loc.y}`, loc.x, loc.y + 10);
      });
      ctx.globalAlpha = 1;

      /**
       * -----------
       * DRAW COMPASS
       * ------------
       */
      const compassOrigin: ScreenPosition = {
        x: ballLoc.current.x,
        y: ballLoc.current.y,
      };

      const x1 = compassOrigin.x;
      const y1 = compassOrigin.y;
      const angleDegrees = ballVector.current.direction;
      // const angleDegrees = 20;
      // adjust degrees for mirrored screen and so 0 deg is pointing up
      // const theta = ((270 - angleDegrees) * Math.PI) / 180;
      const theta = (angleDegrees * Math.PI) / 180;
      const radius = ballVector.current.magnitude * 10;
      // const radius = 100;
      ctx.strokeStyle = 'limegreen';
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x1 + radius * Math.cos(theta), y1 + radius * Math.sin(theta));
      ctx.stroke();

      ctx.beginPath();
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 2;
      ctx.moveTo(TABLE_EDGE_OFFSET_LEFT, 0);
      ctx.lineTo(TABLE_EDGE_OFFSET_LEFT, HEIGHT);
      ctx.stroke();

      ctx.beginPath();
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 2;
      ctx.moveTo(WIDTH - TABLE_EDGE_OFFSET_RIGHT, 0);
      ctx.lineTo(WIDTH - TABLE_EDGE_OFFSET_RIGHT, HEIGHT);
      ctx.stroke();

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
          width={WIDTH}
          height={HEIGHT}
          autoPlay
          loop
          muted
          controls
        ></video>
        <canvas
          id="canvas"
          width={WIDTH}
          height={HEIGHT}
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
