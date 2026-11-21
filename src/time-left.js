/**
 * Calculate how much time is left until a bounty deadline.
 *
 * @param {number} deadline - Deadline timestamp in seconds.
 * @param {number} now - Current timestamp in seconds.
 * @returns {string} Human‑readable time left.
 * @throws {RangeError} If arguments are negative or not integers.
 */
function timeLeft(deadline, now) {
  // Validate inputs
  if (!Number.isInteger(deadline) || !Number.isInteger(now)) {
    throw new RangeError('Arguments must be integers');
  }
  if (deadline < 0 || now < 0) {
    throw new RangeError('Arguments must be non‑negative');
  }

  if (now > deadline) {
    return 'expired';
  }

  const diff = deadline - now; // seconds remaining

  const ONE_DAY = 86400; // 24 * 60 * 60
  const ONE_HOUR = 3600;
  const ONE_MINUTE = 60;

  if (diff >= ONE_DAY) {
    const days = Math.floor(diff / ONE_DAY);
    const hours = Math.floor((diff % ONE_DAY) / ONE_HOUR);
    return `${days}d ${hours}h`;
  }

  if (diff >= ONE_HOUR) {
    const hours = Math.floor(diff / ONE_HOUR);
    const minutes = Math.floor((diff % ONE_HOUR) / ONE_MINUTE);
    return `${hours}h ${minutes}m`;
  }

  if (diff >= ONE_MINUTE) {
    const minutes = Math.floor(diff / ONE_MINUTE);
    return `${minutes}m`;
  }

  return '<1m';
}

module.exports = timeLeft;
