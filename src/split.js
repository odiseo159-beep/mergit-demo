// Bounty payout maths, mirroring MergitEscrow.

export const BPS_DENOMINATOR = 10_000;
export const MAX_FEE_BPS = 500;

/**
 * Splits a bounty into the developer's payout and the protocol fee.
 * @param {bigint} amount gross amount locked in the escrow, in wei
 * @param {number} feeBps protocol fee in basis points
 */
export function split(amount, feeBps) {
  if (typeof amount !== "bigint") throw new TypeError("amount must be a bigint");
  if (amount < 0n) throw new RangeError("amount cannot be negative");
  if (!Number.isInteger(feeBps) || feeBps < 0) throw new RangeError("feeBps must be a non-negative integer");
  if (feeBps > MAX_FEE_BPS) throw new RangeError("feeBps above the 5% cap");

  const fee = (amount * BigInt(feeBps)) / BigInt(BPS_DENOMINATOR);
  return { payout: amount - fee, fee };
}
