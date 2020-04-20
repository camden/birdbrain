import {
  LudumMinigameAnswer,
  LudumMinigameSimonSaysAnswer,
  LudumGameState,
  LudumMinigame,
  LudumMinigameSimonSaysState,
  LudumShape,
  LudumMinigameHydraulicsState,
  LudumMinigameState,
  LudumMinigameHydraulicsButton,
  LudumMinigameHydraulicsButtonPosition,
  LudumMinigameHydraulicsResult,
  LudumMinigameReflexesState,
} from './types';
import { equals, uniq, intersection, times, identity } from 'ramda';
import { pickElement, pickRandomNumber } from 'utils/rng';
import shuffleArray from 'utils/shuffle-array';
import getAllPossibleButtonPositions from './get-button-combos';

export const pickNextMinigame = (): LudumMinigame => {
  return pickElement([
    LudumMinigame.HYDRAULICS,
    // LudumMinigame.SIMON_SAYS,
  ])[0] as LudumMinigame;
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
    case LudumMinigame.HYDRAULICS:
      return checkHydraulicsAnswer(
        game.currentMinigameState as LudumMinigameHydraulicsState,
        answer as LudumMinigameHydraulicsResult
      );
    default:
      return false;
  }
};

export const createMinigameState = (
  minigame: LudumMinigame,
  game: LudumGameState
): LudumMinigameState => {
  switch (minigame) {
    case LudumMinigame.SIMON_SAYS:
      return createSimonSaysState(game);
    case LudumMinigame.HYDRAULICS:
      return createHydraulicsState(game);
    case LudumMinigame.REFLEXES:
      return createReflexesState();
  }
};

const createSimonSaysState = (
  game: LudumGameState
): LudumMinigameSimonSaysState => {
  let targetLength = Math.max(3, Math.floor(0.8 * (game.roundNumber + 2)));
  let timeBetweenShapes = Math.max(200, 1000 - game.roundNumber * 75);

  const elements = [
    LudumShape.CIRCLE,
    LudumShape.STAR,
    LudumShape.TRIANGLE,
    LudumShape.SQUARE,
    LudumShape.DIAMOND,
  ];
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
    timeBetweenShapes,
  };
};

export const createHydraulicsState = (
  game: LudumGameState
): LudumMinigameHydraulicsState => {
  const numberOfPipes = Math.min(
    5,
    Math.max(1, Math.floor((game.roundNumber + 5) * 0.3))
  );
  let iterations = Math.min(
    5,
    Math.max(2, Math.floor((game.roundNumber + 1) * 0.5))
  );

  const pipeMaxLevel = 4;
  const endGoal: LudumMinigameHydraulicsResult = times(
    identity,
    numberOfPipes
  ).map((i) => pickRandomNumber(0, pipeMaxLevel));
  const startConfig: LudumMinigameHydraulicsResult = [
    ...endGoal,
  ] as LudumMinigameHydraulicsResult;
  let buttons: LudumMinigameHydraulicsButton[] = [];

  const allPossibleButtonPositions = getAllPossibleButtonPositions(
    numberOfPipes
  );

  for (let i = 0; i < iterations; i++) {
    // pick a random button of the 6 possible
    const buttonPos = pickElement(
      allPossibleButtonPositions
    )[0] as LudumMinigameHydraulicsButtonPosition;

    // for this position, calculate the possible button values for each position
    // and take the intersection of those values to get a valid value
    let valuesForEachPosition: number[][] = [];

    for (let j = 0; j < startConfig.length; j++) {
      if (buttonPos[j]) {
        const startConfigValue = startConfig[j];
        const valuesForThisPosition = [];
        for (
          let potentialValue = -pipeMaxLevel;
          potentialValue <= pipeMaxLevel;
          potentialValue++
        ) {
          if (potentialValue === 0) {
            continue;
          }

          // if we make a button that adds "potentialValue" to the "startConfigValue",
          // will that be in bounds? (i.e. will it be "reversible")
          const resultOfPressingButton = startConfigValue - potentialValue;
          if (
            resultOfPressingButton >= 0 &&
            resultOfPressingButton <= pipeMaxLevel
          ) {
            valuesForThisPosition.push(potentialValue);
          }
        }

        valuesForEachPosition.push(valuesForThisPosition);
      }
    }

    let potentialValues: number[] = valuesForEachPosition.reduce((acc, cur) => {
      return intersection(acc, cur);
    }, valuesForEachPosition[0]);

    if (!potentialValues || potentialValues.length === 0) {
      iterations++;
      continue;
    }

    let buttonVal = pickElement(potentialValues)[0] as number;

    // add the inverse of that value to all of the affected values
    for (let j = 0; j < startConfig.length; j++) {
      const isAffected = buttonPos[j];
      if (isAffected) {
        startConfig[j] = Math.min(
          pipeMaxLevel,
          Math.max(0, startConfig[j] - buttonVal)
        );
      }
    }

    // push that button onto the list of buttons
    const button: LudumMinigameHydraulicsButton = [buttonVal, buttonPos];
    buttons.push(button);
  }

  // remove duplicate buttons
  buttons = uniq(buttons);

  // shuffle the buttons
  shuffleArray(buttons);

  // and then sort by size (smallest at top)
  buttons = buttons.sort((a, b) => {
    const aSize = a[1].reduce((acc, cur) => (cur ? acc + 1 : acc), 0);
    const bSize = b[1].reduce((acc, cur) => (cur ? acc + 1 : acc), 0);
    return aSize - bSize;
  });

  // @TODO can we try to "fit" the buttons to save space? e.g. multiple in same row if possible

  return {
    pipeMaxLevel,
    correctResult: endGoal,
    startingResult: startConfig,
    buttons,
  };
};

const createReflexesState = (): LudumMinigameReflexesState => {
  return {};
};

const checkHydraulicsAnswer = (
  minigame: LudumMinigameHydraulicsState,
  answer: LudumMinigameHydraulicsResult
): boolean => {
  return equals(minigame.correctResult, answer);
};

const checkSimonSaysAnswer = (
  minigame: LudumMinigameSimonSaysState,
  answer: LudumMinigameSimonSaysAnswer
): boolean => {
  return equals(minigame.phrase, answer);
};
