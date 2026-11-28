// A bounty deadline, from a number of days and the current time.

const SECONDS_PER_DAY = 86_400;
const MIN_DAYS = 1;
const MAX_DAYS = 365;

/**
 * Returns the deadline of a bounty as a bigint of Unix seconds.
 * @param {number} days how long the bounty stays open, 1 to 365
 * @param {number} nowSeconds the current time in Unix seconds
 */
export function deadlineFrom(days, nowSeconds) {
  if (!Number.isInteger(days) || days < MIN_DAYS || days > MAX_DAYS) {
    throw new RangeError("days must be an integer from 1 to 365");
  }
  if (!Number.isInteger(nowSeconds) || nowSeconds < 0) {
    throw new RangeError("nowSeconds must be a non-negative integer");
  }

  return BigInt(nowSeconds) + BigInt(days) * BigInt(SECONDS_PER_DAY);
}
