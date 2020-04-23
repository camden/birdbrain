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
const TABLE_EDGE_OFFSET_LEFT = 270;
const TABLE_EDGE_OFFSET_RIGHT = 270; //offset from left side of screen
const TABLE_Y = 30;
const BOUNCE_TOLERANCE = 50;

const TEAM_LEFT_NAME = 'Cam';
const TEAM_RIGHT_NAME = 'Dad';

export enum Team {
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}

const PingPong: React.FC<PingPongProps> = () => {
  const playPopSound = useSound(ScoreSoundEffect);
  const canvasElement = useRef<HTMLCanvasElement>(null);
  const videoElement = useRef<HTMLVideoElement>(null);
  const [ballLocState, setBallLoc] = useState<ScreenPosition>({ x: 0, y: 0 });
  const [score, setScore] = useState<{
    [Team.LEFT]: number;
    [Team.RIGHT]: number;
  }>({ [Team.LEFT]: 0, [Team.RIGHT]: 0 });
  const ballLoc = useRef<ScreenPosition>({ x: 0, y: 0 });
  const ballLastSeenTime = useRef<number>(0);
  const isBallActive = useRef<boolean>(false);
  const ballVector = useRef<Vector2D>({ magnitude: 0, direction: 0 });
  const sideOfTableBallIsOn = useRef<Team>(Team.LEFT);
  const isBallNearTable = useRef<boolean>(false);
  const didBallBounceOnCurrentSide = useRef<boolean>(false);
  const [side, setSide] = useState<Team>(Team.LEFT);
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

    const text =
      team === Team.LEFT
        ? `Point for ${TEAM_LEFT_NAME}`
        : `Point for ${TEAM_RIGHT_NAME}`;

    const synth = window.speechSynthesis;
    const phrase = new SpeechSynthesisUtterance(text);
    synth.speak(phrase);

    if (team === Team.RIGHT) {
      setScore({
        ...score,
        RIGHT: score.RIGHT + 1,
      });
    } else {
      setScore({
        ...score,
        LEFT: score.LEFT + 1,
      });
    }
  };

  useInterval(() => {
    const { direction, magnitude } = ballVector.current;
    // setSide(sideOfTableBallIsOn.current);

    const timeSinceBallLastSeen = Date.now() - ballLastSeenTime.current;

    if (timeSinceBallLastSeen > 2000 && isBallActive.current) {
      const maybeWentOffscreenToTheLeft =
        sideOfTableBallIsOn.current === Team.LEFT &&
        // direction < 0 &&
        magnitude > 5;

      if (maybeWentOffscreenToTheLeft) {
        if (didBallBounceOnCurrentSide) {
          handleScore(Team.RIGHT);
        } else {
          handleScore(Team.LEFT);
        }
        return;
      }

      const maybeWentOffscreenToTheRight =
        sideOfTableBallIsOn.current === Team.RIGHT &&
        // direction > 0 &&
        magnitude > 5;

      if (maybeWentOffscreenToTheRight) {
        if (didBallBounceOnCurrentSide) {
          handleScore(Team.LEFT);
        } else {
          handleScore(Team.RIGHT);
        }
        return;
      }
    }

    // take average of y values
    // setBallLoc(ballLoc.current);
  }, 50);

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
          const lastBallSide = sideOfTableBallIsOn.current;
          if (nextLoc.x > WIDTH / 2) {
            sideOfTableBallIsOn.current = Team.RIGHT;
          } else {
            sideOfTableBallIsOn.current = Team.LEFT;
          }
          if (lastBallSide !== sideOfTableBallIsOn.current) {
            didBallBounceOnCurrentSide.current = false;
          }
          if (
            nextLoc.y > HEIGHT - TABLE_Y - BOUNCE_TOLERANCE &&
            nextLoc.y < HEIGHT - TABLE_Y + BOUNCE_TOLERANCE
          ) {
            isBallNearTable.current = true;
            didBallBounceOnCurrentSide.current = true;
          } else {
            isBallNearTable.current = false;
          }
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

      const yStartOfBounceArea = HEIGHT - TABLE_Y - BOUNCE_TOLERANCE;
      const yEndOfBounceArea = HEIGHT - TABLE_Y + BOUNCE_TOLERANCE;

      ctx.beginPath();
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 2;
      ctx.moveTo(0, HEIGHT - TABLE_Y);
      ctx.lineTo(WIDTH, HEIGHT - TABLE_Y);
      ctx.stroke();
      ctx.setLineDash([5, 10]);
      ctx.moveTo(0, yStartOfBounceArea);
      ctx.lineTo(WIDTH, yStartOfBounceArea);
      ctx.moveTo(0, yEndOfBounceArea);
      ctx.lineTo(WIDTH, yEndOfBounceArea);
      ctx.stroke();
      ctx.setLineDash([]);

      /**
       * DRAW SIDES
       */
      const heightOfSideBar = 40;
      const heightOfDidBounceBar = 10;
      ctx.globalAlpha = 0.4;
      if (sideOfTableBallIsOn.current === Team.LEFT) {
        ctx.fillStyle = 'red';
        ctx.fillRect(0, 0, WIDTH / 2, heightOfSideBar);
        if (didBallBounceOnCurrentSide.current) {
          ctx.fillRect(
            0,
            yStartOfBounceArea - heightOfDidBounceBar,
            WIDTH / 2,
            heightOfDidBounceBar
          );
        }
      } else {
        ctx.fillStyle = 'blue';
        ctx.fillRect(WIDTH / 2, 0, WIDTH, heightOfSideBar);
        if (didBallBounceOnCurrentSide.current) {
          ctx.fillRect(
            WIDTH / 2,
            yStartOfBounceArea - heightOfDidBounceBar,
            WIDTH / 2,
            heightOfDidBounceBar
          );
        }
      }
      if (isBallNearTable.current) {
        ctx.fillStyle = 'purple';
        ctx.fillRect(0, yStartOfBounceArea, WIDTH, yEndOfBounceArea);
      }
      ctx.globalAlpha = 1;

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
      <h1
        style={{
          textAlign: side === Team.LEFT ? 'left' : 'right',
        }}
      >
        {side === Team.LEFT ? TEAM_LEFT_NAME : TEAM_RIGHT_NAME}
      </h1>
      <div className={styles.scores}>
        <h1>{score.LEFT}</h1>
        <h1>{score.RIGHT}</h1>
      </div>
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
