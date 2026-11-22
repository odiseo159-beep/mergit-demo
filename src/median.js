// The median time from merge to payment, as reported by Mergit.

/**
 * Returns the median of a list of numbers.
 * @param {number[]} values finite numbers
 */
export function median(values) {
  if (!Array.isArray(values)) throw new TypeError("values must be an array");
  if (values.length === 0) throw new RangeError("values cannot be empty");
  for (const value of values) {
    if (typeof value !== "number" || !Number.isFinite(value)) {
      throw new TypeError("values must hold finite numbers");
    }
  }

  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 1 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}
