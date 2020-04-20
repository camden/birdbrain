/**
 * Generates a random int between min and max. Inclusive.
 * @param min
 * @param max
 */
export const pickRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

/**
 * Pick an element from the given array and return a tuple with the element and its index.
 * Does not mutate the array.
 * @param arr
 * @returns [element (T), index]
 */
export function pickElement<T>(arr: T[]): [T | undefined, number] {
  if (arr.length === 0) {
    return [undefined, -1];
  }

  const idx = pickRandomNumber(0, arr.length - 1);
  const element = arr[idx];
  return [element, idx];
}

/**
 * Does not mutate the array.
 * @param arr
 */
export function pickElementAndRemoveFromArr<T>(arr: T[]): [T | undefined, T[]] {
  const [element, idx] = pickElement<T>(arr);

  const newArr = [...arr];
  newArr.splice(idx, 1);
  return [element, newArr];
}
