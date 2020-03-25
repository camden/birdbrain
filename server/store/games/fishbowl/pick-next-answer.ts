import { FishbowlAnswer } from './types';
import answers from './answers';
import { pickRandomNumber } from '../../../utils/rng';

// TODO there should only be a pool of 3*[number of players] answers to draw from
const pickNextAnswer = (alreadySeen: FishbowlAnswer[]): FishbowlAnswer => {
  const idx = pickRandomNumber(0, answers.length - 1);

  return answers[idx];
};

export default pickNextAnswer;
