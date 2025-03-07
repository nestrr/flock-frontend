import { type UnknownArray } from "type-fest";
/**
 * Counts occurrences of value in array
 * @param array The array to evaluate
 * @param target The target value
 * @returns The count of occurrences
 */
export function countOccurrencesInArray(array: UnknownArray, target: unknown) {
  return array.reduce((acc: number, currentValue: unknown) => {
    return currentValue === target ? acc + 1 : acc;
  }, 0);
}
