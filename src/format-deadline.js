// A bounty deadline as the date people read on a receipt, always in UTC.

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * @param {number|bigint} seconds a deadline in Unix seconds, as the chain returns it
 */
export function formatDeadline(seconds) {
  if (typeof seconds !== "number" && typeof seconds !== "bigint") {
    throw new TypeError("seconds must be a number or a bigint");
  }
  if (typeof seconds === "bigint") {
    if (seconds < 0n) throw new RangeError("seconds cannot be negative");
  } else if (!Number.isInteger(seconds) || seconds < 0) {
    throw new RangeError("seconds must be a whole, non-negative number");
  }

  const date = new Date(Number(seconds) * 1_000);
  const month = MONTHS[date.getUTCMonth()];
  const day = date.getUTCDate();
  const year = date.getUTCFullYear();
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");

  return `${month} ${day}, ${year}, ${hours}:${minutes} UTC`;
}
