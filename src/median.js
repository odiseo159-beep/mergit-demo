// Median time from merge to payment, in days.

/**
 * The median of a list of finite numbers.
 *
 * The middle value for an odd count, and the mean of the two middle values for
 * an even count, so `median([20, 19, 41])` is 20 and `median([1, 2, 3, 4])` is
 * 2.5. The input is sorted into a copy: the caller's array is never reordered.
 *
 * @param {number[]} values finite numbers, in any order
 * @returns {number} the median
 */
export function median(values) {
  if (!Array.isArray(values)) throw new TypeError("values must be an array");
  if (values.length === 0) throw new RangeError("values cannot be empty");
  for (const v of values) {
    if (typeof v !== "number" || !Number.isFinite(v)) {
      throw new TypeError("values must hold only finite numbers");
    }
  }

  const sorted = [...values].sort((a, b) => a - b);
  const mid = sorted.length >> 1;
  if (sorted.length % 2 === 1) return sorted[mid];
  return (sorted[mid - 1] + sorted[mid]) / 2;
}