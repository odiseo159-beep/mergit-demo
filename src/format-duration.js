// Turns a number of seconds into a short, readable duration: "20 s", "1 min 5 s", "2 h 3 min".
// Used for receipts like "paid 20 s after the merge".

/**
 * @param {number} seconds a whole, non-negative number of seconds
 * @returns {string}
 */
export function formatDuration(seconds) {
  if (!Number.isInteger(seconds)) throw new TypeError("seconds must be a whole number");
  if (seconds < 0) throw new RangeError("seconds cannot be negative");

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  if (h > 0) return m > 0 ? `${h} h ${m} min` : `${h} h`;
  if (m > 0) return s > 0 ? `${m} min ${s} s` : `${m} min`;
  return `${s} s`;
}
