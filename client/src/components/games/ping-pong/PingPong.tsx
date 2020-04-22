import React, { useRef } from 'react';
import { useTracker } from './useTracker';

export interface PingPongProps {}

const PingPong: React.FC<PingPongProps> = () => {
  const canvasElement = useRef<HTMLCanvasElement>(null);
  useTracker('#video', (event, tracker) => {
    debugger;
    if (!canvasElement.current) {
      return;
    }

    const context = canvasElement.current.getContext('2d');
    if (!context) {
      return;
    }

    const canvas = canvasElement.current;

    context.clearRect(0, 0, canvas.width, canvas.height);
    console.log(event);

    event.data.forEach(function (rect) {
      if (rect.color === 'custom') {
        // rect.color = tracker.customColor;
      }

      context.strokeStyle = rect.color || 'transparent';
      context.strokeRect(rect.x, rect.y, rect.width, rect.height);
      context.font = '11px Helvetica';
      context.fillStyle = '#fff';
      context.fillText(
        'x: ' + rect.x + 'px',
        rect.x + rect.width + 5,
        rect.y + 11
      );
      context.fillText(
        'y: ' + rect.y + 'px',
        rect.x + rect.width + 5,
        rect.y + 22
      );
    });
  });
  return (
    <div>
      <video
        id="video"
        width="600"
        height="450"
        preload={'true'}
        autoPlay
        loop
        muted
        controls
      ></video>
      <canvas id="canvas" width="600" height="450"></canvas>
    </div>
  );
};

export default PingPong;
