/**
 * Returns the median of an array of numbers.
 *
 * @param {number[]} values - Array of finite numbers.
 * @returns {number} Median value.
 * @throws {TypeError} If values is not an array or contains non‑finite numbers.
 * @throws {RangeError} If the array is empty.
 */
function median(values) {
  if (!Array.isArray(values)) {
    throw new TypeError('values must be an array');
  }
  if (values.length === 0) {
    throw new RangeError('cannot compute median of an empty array');
  }
  // Validate elements
  for (const v of values) {
    if (typeof v !== 'number' || !Number.isFinite(v)) {
      throw new TypeError('array must contain only finite numbers');
    }
  }
  // Create a shallow copy and sort numerically
  const sorted = values.slice().sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 1) {
    return sorted[mid];
  }
  // even length: average of two middle values
  return (sorted[mid - 1] + sorted[mid]) / 2;
}

module.exports = median;
