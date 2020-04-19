import {
  LudumMinigameAnswer,
  LudumMinigameSimonSaysAnswer,
  LudumGameState,
  LudumMinigame,
  LudumMinigameSimonSaysState,
  LudumShape,
  LudumMinigameHydraulicsState,
  LudumMinigameState,
} from './types';
import { equals } from 'ramda';
import { pickElement } from 'utils/rng';

export const pickNextMinigame = (): LudumMinigame => {
  return LudumMinigame.HYDRAULICS;
};

export const checkMinigameAnswer = (
  game: LudumGameState,
  answer: LudumMinigameAnswer
): boolean => {
  switch (game.currentMinigame) {
    case LudumMinigame.SIMON_SAYS:
      return checkSimonSaysAnswer(
        game.currentMinigameState as LudumMinigameSimonSaysState,
        answer as LudumMinigameSimonSaysAnswer
      );
    default:
      return false;
  }
};

export const createMinigameState = (
  minigame: LudumMinigame
): LudumMinigameState => {
  switch (minigame) {
    case LudumMinigame.SIMON_SAYS:
      return createSimonSaysState();
    case LudumMinigame.HYDRAULICS:
      return createHydraulicsState();
  }
};

const createSimonSaysState = (): LudumMinigameSimonSaysState => {
  const targetLength = 6;
  const elements = [LudumShape.CIRCLE, LudumShape.HEART, LudumShape.TRIANGLE];
  const phrase: LudumShape[] = [];

  let lastShape: LudumShape;

  for (let i = 0; i < targetLength; i++) {
    const elementsWithoutLastShape = elements.filter((e) => e !== lastShape);
    const nextElement = pickElement(elementsWithoutLastShape)[0] as LudumShape;
    lastShape = nextElement;
    phrase.push(nextElement);
  }

  return {
    phrase,
  };
};

export const createHydraulicsState = (): LudumMinigameHydraulicsState => {
  return {
    pipeMaxLevel: 5,
    correctResult: [1, 3, 5],
    startingResult: [0, 0, 0],
    buttons: [
      [1, [true, false, false]],
      [-1, [true, true, false]],
    ],
  };
};

const checkSimonSaysAnswer = (
  minigame: LudumMinigameSimonSaysState,
  answer: LudumMinigameSimonSaysAnswer
): boolean => {
  return equals(minigame.phrase, answer);
};
