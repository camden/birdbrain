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
  LudumMinigamePizzaState,
  LudumMinigamePizzaCustomer,
  LudumMinigamePizzaTopping,
  LudumMinigamePizzaEvaluation,
  LudumMinigamePizzaAnswer,
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

export const pickNextMinigame = (): LudumMinigame => {
  return pickElement([
    LudumMinigame.PIZZA,
    LudumMinigame.HYDRAULICS,
    LudumMinigame.SIMON_SAYS,
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
    case LudumMinigame.PIZZA:
      return checkPizzaAnswer(
        game.currentMinigameState as LudumMinigamePizzaState,
        answer as LudumMinigamePizzaAnswer
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
    case LudumMinigame.PIZZA:
      return createPizzaState(game);
  }
};

const createSimonSaysState = (
  game: LudumGameState
): LudumMinigameSimonSaysState => {
  let targetLength = Math.max(3, Math.floor(0.6 * (game.roundNumber + 2)));
  let timeBetweenShapes = Math.max(200, 1000 - game.roundNumber * 50);

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
    Math.max(1, Math.floor((game.roundNumber + 3) * 0.4))
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
  // const allPossibleToppings = Object.entries(LudumMinigamePizzaTopping)
  //   .filter((e) => !isNaN(e[0] as any))
  //   .map((e) => e[0] as LudumMinigamePizzaTopping);
  const allPossibleToppings = Object.values(LudumMinigamePizzaTopping);

  let poolOfToppingOptions = [...allPossibleToppings];

  let likes: LudumMinigamePizzaTopping[] = [];
  let dislikes: LudumMinigamePizzaTopping[] = [];

  for (let i = 0; i < numberOfLikes; i++) {
    const [topping, newArr] = pickElementAndRemoveFromArr(poolOfToppingOptions);
    log('generating topping for like: ' + topping);
    if (!topping) {
      log('Something went wrong picking a pizza topping (initial like)');
      continue;
    }

    likes.push(LudumMinigamePizzaTopping[topping]);
    poolOfToppingOptions = newArr;
    log('new pool of options: ' + poolOfToppingOptions);
  }

  for (let i = 0; i < numberOfDislikes; i++) {
    const [topping, newArr] = pickElementAndRemoveFromArr(poolOfToppingOptions);
    if (!topping) {
      log('Something went wrong picking a pizza topping (initial dislike)');
      continue;
    }

    dislikes.push(LudumMinigamePizzaTopping[topping]);
    poolOfToppingOptions = newArr;
  }

  // assign pizza toppings (pick WITH replacement)

  let likesOnPizza: LudumMinigamePizzaTopping[] = [];
  let dislikesOnPizza: LudumMinigamePizzaTopping[] = [];
  let extrasOnPizza: LudumMinigamePizzaTopping[] = [];

  let poolOfLikes: LudumMinigamePizzaTopping[] = [...likes];
  for (let i = 0; i < numberOfLikesOnPizza; i++) {
    // get a random liked pizza topping
    const [topping] = pickElement(poolOfLikes);
    if (!topping) {
      log('Something went wrong picking a pizza topping (like)');
      continue;
    }

    likesOnPizza.push(LudumMinigamePizzaTopping[topping]);
  }

  let poolOfDislikes: LudumMinigamePizzaTopping[] = [...dislikes];
  for (let i = 0; i < numberOfDislikesOnPizza; i++) {
    // get a random disliked pizza topping
    const [topping] = pickElement(poolOfDislikes);
    if (!topping) {
      log('Something went wrong picking a pizza topping (dislike)');
      continue;
    }

    dislikesOnPizza.push(LudumMinigamePizzaTopping[topping]);
  }

  // MINUS the likes & dislikes!
  let poolOfExtras: LudumMinigamePizzaTopping[] = Object.values(
    LudumMinigamePizzaTopping
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

    extrasOnPizza.push(LudumMinigamePizzaTopping[topping]);
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

  let customerEvaluation = LudumMinigamePizzaEvaluation.SKIP;
  const customerLikesSomethingOnPizza =
    intersection(allToppingsOnPizza, likesOnPizza).length > 0;
  const customerDislikesSomethingOnPizza =
    intersection(allToppingsOnPizza, dislikesOnPizza).length > 0;

  if (customerDislikesSomethingOnPizza) {
    customerEvaluation = LudumMinigamePizzaEvaluation.DISLIKE;
  } else if (customerLikesSomethingOnPizza) {
    customerEvaluation = LudumMinigamePizzaEvaluation.LIKE;
  } else {
    customerEvaluation = LudumMinigamePizzaEvaluation.SKIP;
  }

  const customer: LudumMinigamePizzaCustomer = {
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
  game: LudumGameState
): PizzaCustomerConfig => {
  const intendedCustomerEval: LudumMinigamePizzaEvaluation = pickElement([
    LudumMinigamePizzaEvaluation.DISLIKE,
    LudumMinigamePizzaEvaluation.LIKE,
    LudumMinigamePizzaEvaluation.SKIP,
  ])[0] as LudumMinigamePizzaEvaluation;

  const roundNumber = game.roundNumber;

  const numberOfLikes = pickRandomNumber(
    1,
    Math.max(1, Math.min(6, Math.floor(roundNumber * 0.7)))
  );
  const numberOfDislikes = pickRandomNumber(
    1,
    Math.max(1, Math.min(6, Math.floor(roundNumber * 0.8)))
  );
  const numberOfLikesOnPizza =
    intendedCustomerEval === LudumMinigamePizzaEvaluation.LIKE
      ? // intended = like
        pickRandomNumber(
          1,
          Math.max(1, Math.min(7, Math.floor(roundNumber * 0.5)))
        )
      : intendedCustomerEval === LudumMinigamePizzaEvaluation.DISLIKE
      ? // intended = dislike
        pickRandomNumber(
          1,
          Math.max(0, Math.min(6, Math.floor(roundNumber - 1 * 0.5)))
        )
      : // intended = skip
        0;
  const numberOfDislikesOnPizza =
    intendedCustomerEval === LudumMinigamePizzaEvaluation.LIKE
      ? // intended = like
        0
      : intendedCustomerEval === LudumMinigamePizzaEvaluation.DISLIKE
      ? // intended = dislike
        pickRandomNumber(
          1,
          Math.max(1, Math.min(6, Math.floor(roundNumber * 0.6)))
        )
      : // intended = skip
        0;
  const numberOfExtrasOnPizza = pickRandomNumber(
    1,
    Math.max(1, Math.min(8, Math.floor(roundNumber * 0.9)))
  );

  return {
    numberOfLikes,
    numberOfDislikes,
    numberOfLikesOnPizza,
    numberOfDislikesOnPizza,
    numberOfExtrasOnPizza,
  };
};

const createPizzaState = (game: LudumGameState): LudumMinigamePizzaState => {
  const numberOfCustomers = 50;

  let customers: LudumMinigamePizzaCustomer[] = [];

  for (let i = 0; i < numberOfCustomers; i++) {
    const newCustomer = generatePizzaCustomer(
      generatePizzaCustomerConfig(game)
    );
    customers.push(newCustomer);
  }

  return {
    customers,
    targetScore: Math.max(3, Math.min(15, Math.floor(game.roundNumber * 0.9))),
  };
};

const checkPizzaAnswer = (
  minigame: LudumMinigamePizzaState,
  answer: LudumMinigamePizzaAnswer
): boolean => {
  return minigame.targetScore === answer;
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
