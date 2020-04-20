import { uniq } from 'ramda';
import { LudumMinigameHydraulicsButtonPosition } from './types';

const genCombo = (len: number) => {
  return uniq(genComboHelper(len, []));
};

const genComboHelper = (len: number, acc: boolean[][]): boolean[][] => {
  if (len === 1) {
    return acc.concat([[true], [false]]);
  }

  const suffixTrue = genComboHelper(len - 1, []).map((arr) =>
    arr.concat([true])
  );
  const suffixFalse = genComboHelper(len - 1, []).map((arr) =>
    arr.concat([false])
  );
  const prefixTrue = genComboHelper(len - 1, []).map((arr) =>
    [true].concat(arr)
  );
  const prefixFalse = genComboHelper(len - 1, []).map((arr) =>
    [false].concat(arr)
  );
  return suffixTrue.concat(suffixFalse).concat(prefixTrue).concat(prefixFalse);
};

const getValid = (parentArr: boolean[][]) => {
  return parentArr.filter((arr) => {
    let lastOneFalse = false;
    let sawTrue = false;
    for (let i = 0; i < arr.length; i++) {
      const isTrue = arr[i];
      const isFalse = !isTrue;
      if (isFalse) {
        lastOneFalse = true;
      }

      if (isTrue && sawTrue && lastOneFalse) {
        return false;
      }
      if (isTrue) {
        sawTrue = true;
        lastOneFalse = false;
      }
    }

    return sawTrue;
  });
};

// prettier-ignore
const allPossible = {"1": [[true]], "2": [[true, true], [false, true], [true, false]], "3": [[true, true, true], [false, true, true], [false, false, true], [true, true, false], [false, true, false], [true, false, false]], "4": [[true, true, true, true], [false, true, true, true], [false, false, true, true], [false, false, false, true], [true, true, true, false], [false, true, true, false], [false, false, true, false], [true, true, false, false], [false, true, false, false], [true, false, false, false]], "5": [[true, true, true, true, true], [false, true, true, true, true], [false, false, true, true, true], [false, false, false, true, true], [false, false, false, false, true], [true, true, true, true, false], [false, true, true, true, false], [false, false, true, true, false], [false, false, false, true, false], [true, true, true, false, false], [false, true, true, false, false], [false, false, true, false, false], [true, true, false, false, false], [false, true, false, false, false], [true, false, false, false, false]], "6": [[true, true, true, true, true, true], [false, true, true, true, true, true], [false, false, true, true, true, true], [false, false, false, true, true, true], [false, false, false, false, true, true], [false, false, false, false, false, true], [true, true, true, true, true, false], [false, true, true, true, true, false], [false, false, true, true, true, false], [false, false, false, true, true, false], [false, false, false, false, true, false], [true, true, true, true, false, false], [false, true, true, true, false, false], [false, false, true, true, false, false], [false, false, false, true, false, false], [true, true, true, false, false, false], [false, true, true, false, false, false], [false, false, true, false, false, false], [true, true, false, false, false, false], [false, true, false, false, false, false], [true, false, false, false, false, false]], "7": [[true, true, true, true, true, true, true], [false, true, true, true, true, true, true], [false, false, true, true, true, true, true], [false, false, false, true, true, true, true], [false, false, false, false, true, true, true], [false, false, false, false, false, true, true], [false, false, false, false, false, false, true], [true, true, true, true, true, true, false], [false, true, true, true, true, true, false], [false, false, true, true, true, true, false], [false, false, false, true, true, true, false], [false, false, false, false, true, true, false], [false, false, false, false, false, true, false], [true, true, true, true, true, false, false], [false, true, true, true, true, false, false], [false, false, true, true, true, false, false], [false, false, false, true, true, false, false], [false, false, false, false, true, false, false], [true, true, true, true, false, false, false], [false, true, true, true, false, false, false], [false, false, true, true, false, false, false], [false, false, false, true, false, false, false], [true, true, true, false, false, false, false], [false, true, true, false, false, false, false], [false, false, true, false, false, false, false], [true, true, false, false, false, false, false], [false, true, false, false, false, false, false], [true, false, false, false, false, false, false]], "8": [[true, true, true, true, true, true, true, true], [false, true, true, true, true, true, true, true], [false, false, true, true, true, true, true, true], [false, false, false, true, true, true, true, true], [false, false, false, false, true, true, true, true], [false, false, false, false, false, true, true, true], [false, false, false, false, false, false, true, true], [false, false, false, false, false, false, false, true], [true, true, true, true, true, true, true, false], [false, true, true, true, true, true, true, false], [false, false, true, true, true, true, true, false], [false, false, false, true, true, true, true, false], [false, false, false, false, true, true, true, false], [false, false, false, false, false, true, true, false], [false, false, false, false, false, false, true, false], [true, true, true, true, true, true, false, false], [false, true, true, true, true, true, false, false], [false, false, true, true, true, true, false, false], [false, false, false, true, true, true, false, false], [false, false, false, false, true, true, false, false], [false, false, false, false, false, true, false, false], [true, true, true, true, true, false, false, false], [false, true, true, true, true, false, false, false], [false, false, true, true, true, false, false, false], [false, false, false, true, true, false, false, false], [false, false, false, false, true, false, false, false], [true, true, true, true, false, false, false, false], [false, true, true, true, false, false, false, false], [false, false, true, true, false, false, false, false], [false, false, false, true, false, false, false, false], [true, true, true, false, false, false, false, false], [false, true, true, false, false, false, false, false], [false, false, true, false, false, false, false, false], [true, true, false, false, false, false, false, false], [false, true, false, false, false, false, false, false], [true, false, false, false, false, false, false, false]]}

const getAllPossibleButtonPositions = (
  numberOfColumns: number
): LudumMinigameHydraulicsButtonPosition[] => {
  if (numberOfColumns < 1 || numberOfColumns > 8) {
    throw new Error('Invalid number of columns');
  }

  return allPossible[numberOfColumns as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8];
};

export default getAllPossibleButtonPositions;
