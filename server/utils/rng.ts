/**
 * Generates a random int between min and max. Inclusive.
 * @param min
 * @param max
 */
export const pickRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
