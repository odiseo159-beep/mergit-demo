// Turns basis points into a short percentage: 150 → "1.5%", 500 → "5%", 25 → "0.25%".
// Used to show the protocol fee, which the escrow stores in basis points.

/**
 * @param {number} bps a whole number of basis points, 0 to 10000
 * @returns {string}
 */
export function formatBps(bps) {
  if (!Number.isInteger(bps)) throw new TypeError("bps must be a whole number");
  if (bps < 0 || bps > 10000) throw new RangeError("bps must be between 0 and 10000");

  const whole = Math.floor(bps / 100);
  const cents = bps % 100;
  if (cents === 0) return `${whole}%`;
  return `${whole}.${String(cents).padStart(2, "0").replace(/0$/, "")}%`;
}
