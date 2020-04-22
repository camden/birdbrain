import { useEffect } from 'react';

export type ColorPredicate = (r: number, g: number, b: number) => boolean;

export const useTracker = (
  videoElementID: string,
  getVideoElement: () => HTMLVideoElement | null,
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
        console.log(videoElement);
      }

      const colorTracker = new tracking.ColorTracker();

      tracking.track(videoElementID, colorTracker, { camera: true });

      colorTracker.on('track', (event) => onTrack(event, colorTracker));

      tracking.ColorTracker.registerColor('pingpong', function (r, g, b) {
        return r > 100;
      });
    }

    load();
  });
};
