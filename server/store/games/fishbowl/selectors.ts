import { FishbowlGameState, FishbowlAnswer } from './types';

export const getCurrentAnswer = (game: FishbowlGameState): FishbowlAnswer => {
  return game.answersForCurrentGameType[0];
};
