// Turns an escrow deadline in Unix seconds into the date people read on a receipt:
// "Dec 5, 2026, 05:14 UTC". Always UTC, so a receipt reads the same everywhere.

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/**
 * @param {number | bigint} seconds a whole, non-negative number of seconds since the epoch
 * @returns {string}
 */
export function formatDeadline(seconds) {
  let value;

  if (typeof seconds === "bigint") {
    value = seconds;
  } else if (typeof seconds === "number") {
    if (!Number.isInteger(seconds)) throw new RangeError("seconds must be a whole number");
    value = BigInt(seconds);
  } else {
    throw new TypeError("seconds must be a number or a bigint");
  }

  if (value < 0n) throw new RangeError("seconds cannot be negative");

  const date = new Date(Number(value) * 1000);

  const day = date.getUTCDate();
  const month = MONTHS[date.getUTCMonth()];
  const year = date.getUTCFullYear();
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");

  return `${month} ${day}, ${year}, ${hours}:${minutes} UTC`;
}
