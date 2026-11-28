// Turns an escrow deadline in Unix seconds into the date shown on a receipt.

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/**
 * @param {number|bigint} seconds a non-negative whole number of Unix seconds
 * @returns {string}
 */
export function formatDeadline(seconds) {
  if (typeof seconds !== "number" && typeof seconds !== "bigint") {
    throw new TypeError("seconds must be a number or bigint");
  }
  if (typeof seconds === "number" && !Number.isInteger(seconds)) {
    throw new RangeError("seconds must be a whole number");
  }
  if (seconds < 0) throw new RangeError("seconds cannot be negative");

  const date = new Date(Number(seconds) * 1000);
  if (Number.isNaN(date.getTime())) throw new RangeError("seconds is outside the date range");

  const day = date.getUTCDate();
  const hour = String(date.getUTCHours()).padStart(2, "0");
  const minute = String(date.getUTCMinutes()).padStart(2, "0");
  return `${MONTHS[date.getUTCMonth()]} ${day}, ${date.getUTCFullYear()}, ${hour}:${minute} UTC`;
}
