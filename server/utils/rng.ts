/**
 * Generates a random int between min and max. Inclusive.
 * @param min
 * @param max
 */
export const pickRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export function pickElement<T>(arr: T[]): [T | undefined, number] {
  if (arr.length === 0) {
    return [undefined, -1];
  }

  const idx = pickRandomNumber(0, arr.length - 1);
  const element = arr[idx];
  return [element, idx];
}
