import 'tracking';
import { useEffect } from 'react';

export type ColorPredicate = (r: number, g: number, b: number) => boolean;

export const useTracker = (
  videoElementID: string,
  onTrack: (event: tracking.TrackEvent, tracker: tracking.ColorTracker) => void,
  colorPredicates?: ColorPredicate[]
) => {
  useEffect(() => {
    const colorTracker = new tracking.ColorTracker([
      'magenta',
      'cyan',
      'yellow',
    ]);

    tracking.track(videoElementID, colorTracker, { camera: true });

    colorTracker.on('track', (event) => onTrack(event, colorTracker));
  });
};
