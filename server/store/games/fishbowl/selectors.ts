import { FishbowlGameState, FishbowlAnswer } from './types';

export const getCurrentAnswer = (game: FishbowlGameState): FishbowlAnswer => {
  return game.answersForCurrentGameType[game.indexOfCurrentAnswer];
};
