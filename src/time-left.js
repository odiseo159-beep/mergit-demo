export function timeLeft(deadline, now) {
  if (typeof deadline !== 'number' || typeof now !== 'number' || !Number.isInteger(deadline) || !Number.isInteger(now) || deadline < 0 || now < 0) {
    throw new RangeError("Arguments must be non-negative integers");
  }
  if (now > deadline) return "expired";
  const diff = deadline - now;
  if (diff < 60) return "<1m";
  if (diff < 3600) return Math.floor(diff / 60) + "m";
  if (diff < 86400) return Math.floor(diff / 3600) + "h " + Math.floor((diff % 3600) / 60) + "m";
  return Math.floor(diff / 86400) + "d " + Math.floor((diff % 86400) / 3600) + "h";
}
