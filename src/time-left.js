// How long a bounty stays open, written the way people read it.

const DAY = 86_400;
const HOUR = 3_600;
const MINUTE = 60;

/**
 * @param {number} deadline Unix seconds
 * @param {number} now Unix seconds
 */
export function timeLeft(deadline, now) {
  if (!Number.isInteger(deadline) || deadline < 0) throw new RangeError("deadline must be a non-negative integer");
  if (!Number.isInteger(now) || now < 0) throw new RangeError("now must be a non-negative integer");

  if (now > deadline) return "expired";

  const left = deadline - now;
  if (left >= DAY) return `${Math.floor(left / DAY)}d ${Math.floor((left % DAY) / HOUR)}h`;
  if (left >= HOUR) return `${Math.floor(left / HOUR)}h ${Math.floor((left % HOUR) / MINUTE)}m`;
  if (left >= MINUTE) return `${Math.floor(left / MINUTE)}m`;
  return "<1m";
}
