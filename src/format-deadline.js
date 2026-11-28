// Formats an escrow deadline (Unix seconds) into readable receipt text: "Dec 5, 2026, 05:14 UTC"

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
// JavaScript Date only represents timestamps within ±8.64e15 ms (±8_640_000_000_000 s).
const MAX_UNIX_SECONDS = 8_640_000_000_000n;

/**
 * Turns an escrow deadline (Unix seconds) into a readable UTC date string.
 * @param {number | bigint} seconds non-negative whole seconds since Unix epoch
 * @returns {string}
 */
export function formatDeadline(seconds) {
  const wholeSeconds = normalizeUnixSeconds(seconds);
  const d = new Date(Number(wholeSeconds) * 1000);

  const month = MONTHS[d.getUTCMonth()];
  const day = d.getUTCDate();
  const year = d.getUTCFullYear();
  const hours = String(d.getUTCHours()).padStart(2, "0");
  const minutes = String(d.getUTCMinutes()).padStart(2, "0");

  return `${month} ${day}, ${year}, ${hours}:${minutes} UTC`;
}

/**
 * Validates and normalizes Unix seconds (number or bigint) into a bounded bigint.
 * @param {number | bigint} seconds
 * @returns {bigint}
 */
function normalizeUnixSeconds(seconds) {
  if (typeof seconds !== "number" && typeof seconds !== "bigint") {
    throw new TypeError("seconds must be a number or a bigint");
  }

  if (typeof seconds === "number" && !Number.isInteger(seconds)) {
    throw new RangeError("seconds must be a whole number");
  }

  const wholeSeconds = typeof seconds === "bigint" ? seconds : BigInt(seconds);
  if (wholeSeconds < 0n) {
    throw new RangeError("seconds cannot be negative");
  }
  if (wholeSeconds > MAX_UNIX_SECONDS) {
    throw new RangeError("seconds exceeds maximum representable date");
  }

  return wholeSeconds;
}
