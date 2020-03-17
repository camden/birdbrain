import { FishbowlGameState, Timestamp } from './types';
import { ROUND_DURATION_MS } from '.';

export const getRoundEndTime = () => (
  game: FishbowlGameState
): Timestamp | null => {
  if (!game.roundStartTime) {
    return null;
  }

  return game.roundStartTime + ROUND_DURATION_MS;
};
