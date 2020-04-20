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

const getAllPossibleButtonPositions = (
  numberOfColumns: number
): LudumMinigameHydraulicsButtonPosition[] => {
  return getValid(genCombo(numberOfColumns));
};

export default getAllPossibleButtonPositions;
