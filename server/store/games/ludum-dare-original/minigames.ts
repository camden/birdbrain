import {
  LudumOriginalMinigameAnswer,
  LudumOriginalMinigameSimonSaysAnswer,
  LudumOriginalGameState,
  LudumOriginalMinigame,
  LudumOriginalMinigameSimonSaysState,
  LudumOriginalShape,
  LudumOriginalMinigameHydraulicsState,
  LudumOriginalMinigameState,
  LudumOriginalMinigameHydraulicsButton,
  LudumOriginalMinigameHydraulicsButtonPosition,
  LudumOriginalMinigameHydraulicsResult,
  LudumOriginalMinigameReflexesState,
  LudumOriginalMinigamePizzaState,
  LudumOriginalMinigamePizzaCustomer,
  LudumOriginalMinigamePizzaTopping,
  LudumOriginalMinigamePizzaEvaluation,
  LudumOriginalMinigamePizzaAnswer,
} from './types';
import { equals, uniq, intersection, times, identity, without } from 'ramda';
import {
  pickElement,
  pickRandomNumber,
  pickElementAndRemoveFromArr,
} from 'utils/rng';
import shuffleArray from 'utils/shuffle-array';
import getAllPossibleButtonPositions from './get-button-combos';
import { log } from 'utils/log';

export const pickNextMinigame = (): LudumOriginalMinigame => {
  return pickElement([
    LudumOriginalMinigame.PIZZA,
    LudumOriginalMinigame.HYDRAULICS,
    LudumOriginalMinigame.SIMON_SAYS,
  ])[0] as LudumOriginalMinigame;
};

export const checkMinigameAnswer = (
  game: LudumOriginalGameState,
  answer: LudumOriginalMinigameAnswer
): boolean => {
  switch (game.currentMinigame) {
    case LudumOriginalMinigame.SIMON_SAYS:
      return checkSimonSaysAnswer(
        game.currentMinigameState as LudumOriginalMinigameSimonSaysState,
        answer as LudumOriginalMinigameSimonSaysAnswer
      );
    case LudumOriginalMinigame.HYDRAULICS:
      return checkHydraulicsAnswer(
        game.currentMinigameState as LudumOriginalMinigameHydraulicsState,
        answer as LudumOriginalMinigameHydraulicsResult
      );
    case LudumOriginalMinigame.PIZZA:
      return checkPizzaAnswer(
        game.currentMinigameState as LudumOriginalMinigamePizzaState,
        answer as LudumOriginalMinigamePizzaAnswer
      );
    default:
      return false;
  }
};

export const createMinigameState = (
  minigame: LudumOriginalMinigame,
  game: LudumOriginalGameState
): LudumOriginalMinigameState => {
  switch (minigame) {
    case LudumOriginalMinigame.SIMON_SAYS:
      return createSimonSaysState(game);
    case LudumOriginalMinigame.HYDRAULICS:
      return createHydraulicsState(game);
    case LudumOriginalMinigame.REFLEXES:
      return createReflexesState();
    case LudumOriginalMinigame.PIZZA:
      return createPizzaState(game);
  }
};

const createSimonSaysState = (
  game: LudumOriginalGameState
): LudumOriginalMinigameSimonSaysState => {
  const targetLength = Math.max(3, Math.floor(0.5 * (game.roundNumber + 4)));
  const timeBetweenShapes = Math.max(200, 1000 - game.roundNumber * 25);

  const elements = [
    LudumOriginalShape.CIRCLE,
    LudumOriginalShape.STAR,
    LudumOriginalShape.TRIANGLE,
    LudumOriginalShape.SQUARE,
    LudumOriginalShape.DIAMOND,
  ];
  const phrase: LudumOriginalShape[] = [];

  let lastShape: LudumOriginalShape;

  for (let i = 0; i < targetLength; i++) {
    const elementsWithoutLastShape = elements.filter((e) => e !== lastShape);
    const nextElement = pickElement(
      elementsWithoutLastShape
    )[0] as LudumOriginalShape;
    lastShape = nextElement;
    phrase.push(nextElement);
  }

  return {
    phrase,
    timeBetweenShapes,
  };
};

export const createHydraulicsState = (
  game: LudumOriginalGameState
): LudumOriginalMinigameHydraulicsState => {
  const numberOfPipes = Math.min(
    5,
    Math.max(1, Math.floor((game.roundNumber + 3) * 0.4))
  );
  let iterations = Math.min(
    5,
    Math.max(2, Math.floor((game.roundNumber + 1) * 0.5))
  );

  const pipeMaxLevel = 4;
  const endGoal: LudumOriginalMinigameHydraulicsResult = times(
    identity,
    numberOfPipes
  ).map((i) => pickRandomNumber(0, pipeMaxLevel));
  const startConfig: LudumOriginalMinigameHydraulicsResult = [
    ...endGoal,
  ] as LudumOriginalMinigameHydraulicsResult;
  let buttons: LudumOriginalMinigameHydraulicsButton[] = [];

  const allPossibleButtonPositions = getAllPossibleButtonPositions(
    numberOfPipes
  );

  for (let i = 0; i < iterations; i++) {
    // pick a random button of the 6 possible
    const buttonPos = pickElement(
      allPossibleButtonPositions
    )[0] as LudumOriginalMinigameHydraulicsButtonPosition;

    // for this position, calculate the possible button values for each position
    // and take the intersection of those values to get a valid value
    const valuesForEachPosition: number[][] = [];

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

    const potentialValues: number[] = valuesForEachPosition.reduce(
      (acc, cur) => {
        return intersection(acc, cur);
      },
      valuesForEachPosition[0]
    );

    if (!potentialValues || potentialValues.length === 0) {
      iterations++;
      continue;
    }

    const buttonVal = pickElement(potentialValues)[0] as number;

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
    const button: LudumOriginalMinigameHydraulicsButton = [
      buttonVal,
      buttonPos,
    ];
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

const createReflexesState = (): LudumOriginalMinigameReflexesState => {
  return {};
};

type PizzaCustomerConfig = {
  numberOfLikes: number;
  numberOfDislikes: number;
  numberOfLikesOnPizza: number;
  numberOfDislikesOnPizza: number;
  numberOfExtrasOnPizza: number;
};

const generatePizzaCustomer = (config: PizzaCustomerConfig) => {
  const {
    numberOfLikes,
    numberOfDislikes,
    numberOfDislikesOnPizza,
    numberOfExtrasOnPizza,
    numberOfLikesOnPizza,
  } = config;

  // generate the likes and dislikes

  // https://stackoverflow.com/a/59896324/2399208
  // const allPossibleToppings = Object.entries(LudumOriginalMinigamePizzaTopping)
  //   .filter((e) => !isNaN(e[0] as any))
  //   .map((e) => e[0] as LudumOriginalMinigamePizzaTopping);
  const allPossibleToppings = Object.values(LudumOriginalMinigamePizzaTopping);

  let poolOfToppingOptions = [...allPossibleToppings];

  const likes: LudumOriginalMinigamePizzaTopping[] = [];
  const dislikes: LudumOriginalMinigamePizzaTopping[] = [];

  for (let i = 0; i < numberOfLikes; i++) {
    const [topping, newArr] = pickElementAndRemoveFromArr(poolOfToppingOptions);
    log('generating topping for like: ' + topping);
    if (!topping) {
      log('Something went wrong picking a pizza topping (initial like)');
      continue;
    }

    likes.push(LudumOriginalMinigamePizzaTopping[topping]);
    poolOfToppingOptions = newArr;
    log('new pool of options: ' + poolOfToppingOptions);
  }

  for (let i = 0; i < numberOfDislikes; i++) {
    const [topping, newArr] = pickElementAndRemoveFromArr(poolOfToppingOptions);
    if (!topping) {
      log('Something went wrong picking a pizza topping (initial dislike)');
      continue;
    }

    dislikes.push(LudumOriginalMinigamePizzaTopping[topping]);
    poolOfToppingOptions = newArr;
  }

  // assign pizza toppings (pick WITH replacement)

  const likesOnPizza: LudumOriginalMinigamePizzaTopping[] = [];
  const dislikesOnPizza: LudumOriginalMinigamePizzaTopping[] = [];
  const extrasOnPizza: LudumOriginalMinigamePizzaTopping[] = [];

  const poolOfLikes: LudumOriginalMinigamePizzaTopping[] = [...likes];
  for (let i = 0; i < numberOfLikesOnPizza; i++) {
    // get a random liked pizza topping
    const [topping] = pickElement(poolOfLikes);
    if (!topping) {
      log('Something went wrong picking a pizza topping (like)');
      continue;
    }

    likesOnPizza.push(LudumOriginalMinigamePizzaTopping[topping]);
  }

  const poolOfDislikes: LudumOriginalMinigamePizzaTopping[] = [...dislikes];
  for (let i = 0; i < numberOfDislikesOnPizza; i++) {
    // get a random disliked pizza topping
    const [topping] = pickElement(poolOfDislikes);
    if (!topping) {
      log('Something went wrong picking a pizza topping (dislike)');
      continue;
    }

    dislikesOnPizza.push(LudumOriginalMinigamePizzaTopping[topping]);
  }

  // MINUS the likes & dislikes!
  let poolOfExtras: LudumOriginalMinigamePizzaTopping[] = Object.values(
    LudumOriginalMinigamePizzaTopping
  );
  poolOfExtras = without(likes, poolOfExtras);
  poolOfExtras = without(dislikes, poolOfExtras);
  for (let i = 0; i < numberOfExtrasOnPizza; i++) {
    // get a random extra pizza topping
    const [topping] = pickElement(poolOfExtras);
    if (!topping) {
      log('Something went wrong picking a pizza topping (extra)');
      continue;
    }

    extrasOnPizza.push(LudumOriginalMinigamePizzaTopping[topping]);
  }

  log(
    'ON PIZZA -> likes: ' +
      likesOnPizza +
      ' dislikes: ' +
      dislikesOnPizza +
      ' extras: ' +
      extrasOnPizza
  );

  const allToppingsOnPizza = likesOnPizza
    .concat(dislikesOnPizza)
    .concat(extrasOnPizza);

  let customerEvaluation = LudumOriginalMinigamePizzaEvaluation.SKIP;
  const customerLikesSomethingOnPizza =
    intersection(allToppingsOnPizza, likesOnPizza).length > 0;
  const customerDislikesSomethingOnPizza =
    intersection(allToppingsOnPizza, dislikesOnPizza).length > 0;

  if (customerDislikesSomethingOnPizza) {
    customerEvaluation = LudumOriginalMinigamePizzaEvaluation.DISLIKE;
  } else if (customerLikesSomethingOnPizza) {
    customerEvaluation = LudumOriginalMinigamePizzaEvaluation.LIKE;
  } else {
    customerEvaluation = LudumOriginalMinigamePizzaEvaluation.SKIP;
  }

  const customer: LudumOriginalMinigamePizzaCustomer = {
    likes: likes,
    dislikes: dislikes,
    pizza: allToppingsOnPizza,
    randomPizzaRotation: pickRandomNumber(1, 360),
    customerEvaluation,
  };

  console.log('Generating a customer with config: ', config, customer);
  return customer;
};

const generatePizzaCustomerConfig = (
  game: LudumOriginalGameState
): PizzaCustomerConfig => {
  const intendedCustomerEval: LudumOriginalMinigamePizzaEvaluation = pickElement(
    [
      LudumOriginalMinigamePizzaEvaluation.DISLIKE,
      LudumOriginalMinigamePizzaEvaluation.LIKE,
      LudumOriginalMinigamePizzaEvaluation.SKIP,
    ]
  )[0] as LudumOriginalMinigamePizzaEvaluation;

  const roundNumber = game.roundNumber;

  const numberOfLikes = pickRandomNumber(
    1,
    Math.max(1, Math.min(6, Math.floor(roundNumber * 0.6)))
  );
  const numberOfDislikes = pickRandomNumber(
    1,
    Math.max(1, Math.min(6, Math.floor(roundNumber * 0.6)))
  );
  const numberOfLikesOnPizza =
    intendedCustomerEval === LudumOriginalMinigamePizzaEvaluation.LIKE
      ? // intended = like
        pickRandomNumber(
          1,
          Math.max(1, Math.min(7, Math.floor(roundNumber * 0.5)))
        )
      : intendedCustomerEval === LudumOriginalMinigamePizzaEvaluation.DISLIKE
      ? // intended = dislike
        pickRandomNumber(
          1,
          Math.max(0, Math.min(6, Math.floor(roundNumber - 1 * 0.5)))
        )
      : // intended = skip
        0;
  const numberOfDislikesOnPizza =
    intendedCustomerEval === LudumOriginalMinigamePizzaEvaluation.LIKE
      ? // intended = like
        0
      : intendedCustomerEval === LudumOriginalMinigamePizzaEvaluation.DISLIKE
      ? // intended = dislike
        pickRandomNumber(
          1,
          Math.max(1, Math.min(6, Math.floor(roundNumber * 0.6)))
        )
      : // intended = skip
        0;
  const numberOfExtrasOnPizza = pickRandomNumber(
    1,
    Math.max(1, Math.min(8, Math.floor(roundNumber * 0.7)))
  );

  return {
    numberOfLikes,
    numberOfDislikes,
    numberOfLikesOnPizza,
    numberOfDislikesOnPizza,
    numberOfExtrasOnPizza,
  };
};

const createPizzaState = (
  game: LudumOriginalGameState
): LudumOriginalMinigamePizzaState => {
  const numberOfCustomers = 50;

  const customers: LudumOriginalMinigamePizzaCustomer[] = [];

  for (let i = 0; i < numberOfCustomers; i++) {
    const newCustomer = generatePizzaCustomer(
      generatePizzaCustomerConfig(game)
    );
    customers.push(newCustomer);
  }

  return {
    customers,
    targetScore: Math.max(3, Math.min(6, Math.floor(game.roundNumber * 0.3))),
  };
};

const checkPizzaAnswer = (
  minigame: LudumOriginalMinigamePizzaState,
  answer: LudumOriginalMinigamePizzaAnswer
): boolean => {
  return minigame.targetScore === answer;
};

const checkHydraulicsAnswer = (
  minigame: LudumOriginalMinigameHydraulicsState,
  answer: LudumOriginalMinigameHydraulicsResult
): boolean => {
  return equals(minigame.correctResult, answer);
};

const checkSimonSaysAnswer = (
  minigame: LudumOriginalMinigameSimonSaysState,
  answer: LudumOriginalMinigameSimonSaysAnswer
): boolean => {
  return equals(minigame.phrase, answer);
};
