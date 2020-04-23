import { useEffect } from 'react';

export type ColorPredicate = (r: number, g: number, b: number) => boolean;

const between = (x: number, min: number, max: number, fuzz?: number) => {
  return x >= min - (fuzz || 0) && x <= max + (fuzz || 0);
};

interface RGBColor {
  r: number;
  g: number;
  b: number;
}

function getColorDistance(target: RGBColor, actual: RGBColor) {
  return Math.sqrt(
    (target.r - actual.r) * (target.r - actual.r) +
      (target.g - actual.g) * (target.g - actual.g) +
      (target.b - actual.b) * (target.b - actual.b)
  );
}

export const useTracker = (
  videoElementID: string,
  getVideoElement: () => HTMLVideoElement | null,
  getTolerance: () => number,
  onTrack: (event: tracking.TrackEvent, tracker: tracking.ColorTracker) => void,
  colorPredicates?: ColorPredicate[]
) => {
  useEffect(() => {
    async function load() {
      const videoElement = getVideoElement();
      if (!videoElement) {
        console.error('null video element');
        return;
      } else {
        // console.log(videoElement);
      }

      tracking.ColorTracker.registerColor('pingpong', function (r, g, b) {
        // 146 83 58
        // 171 78 45
        // 147 96 65
        // 200 141 108
        // 159 85 60
        // 195 107 78
        // const colorOfBallOutside = {
        //   r: 190,
        //   g: 100,
        //   b: 11,
        // };
        const colorOfBallOutside = {
          r: 148,
          g: 96,
          b: 40,
        };

        const colorOfBallInMyRoom = {
          r: 240,
          g: 159,
          b: 102,
        };

        const dist = getColorDistance(colorOfBallInMyRoom, { r, g, b });
        if (dist < 10) {
          // console.log(`color: ${r},${g},${b} --- distance: ${dist}`);
        }
        return dist < getTolerance();
        // return (
        //   between(r, 180, 180, 20) &&
        //   between(g, 90, 90, 60) &&
        //   between(b, 66, 66, 30)
        // );
      });

      const colorTracker = new tracking.ColorTracker(['pingpong']);
      colorTracker.setMinGroupSize(20);
      colorTracker.setMinDimension(2);

      tracking.track(videoElementID, colorTracker, { camera: true });

      colorTracker.on('track', (event) => onTrack(event, colorTracker));
    }

    load();
  });
};
