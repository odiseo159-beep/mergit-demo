// Turns an escrow deadline (Unix seconds) into the date on a receipt, e.g. "Dec 5, 2026, 05:14 UTC".

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * @param {number|bigint} seconds a whole, non-negative Unix timestamp in seconds, as stored on chain
 * @returns {string}
 */
export function formatDeadline(seconds) {
  if (typeof seconds !== "number" && typeof seconds !== "bigint") {
    throw new TypeError("seconds must be a number or a bigint");
  }
  if (typeof seconds === "number" && !Number.isInteger(seconds)) {
    throw new RangeError("seconds must be a whole number");
  }
  if (seconds < 0) throw new RangeError("seconds cannot be negative");

  const date = new Date(Number(seconds) * 1000);
  const month = MONTHS[date.getUTCMonth()];
  const day = date.getUTCDate();
  const year = date.getUTCFullYear();
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");

  return `${month} ${day}, ${year}, ${hours}:${minutes} UTC`;
}
