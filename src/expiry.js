export function isExpired(deadline, now) {
  if (typeof deadline !== 'bigint') {
    throw new TypeError('deadline must be a bigint');
  }
  if (typeof now !== 'number' || !Number.isInteger(now)) {
    throw new RangeError('now must be an integer');
  }
  if (now < 0) {
    throw new RangeError('now must be non-negative');
  }
  // Expired only when now is strictly greater than deadline.
  return deadline < BigInt(now);
}
