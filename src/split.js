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

/**
 * Inverse of split: the smallest amount a funder must lock so the developer
 * receives at least `netTarget` after the protocol fee.
 *
 * It is not simply `netTarget / (1 - fee)` rounded up. split rounds the fee
 * down, in the developer's favour, so the payout of `g` is
 * `ceil(g * (D - fee) / D)`, and the smallest `g` with a payout of at least
 * `t` is `floor((t - 1) * D / (D - fee)) + 1`. Rounding the plain quotient up
 * asked for one wei more than needed in most cases (1 wei net needed 2 at
 * 1.5%, when 1 already pays 1).
 * @param {bigint} netTarget what the developer should receive, in wei
 * @param {number} feeBps protocol fee in basis points
 */
export function grossFor(netTarget, feeBps) {
  if (typeof netTarget !== "bigint") throw new TypeError("netTarget must be a bigint");
  if (netTarget < 0n) throw new RangeError("netTarget cannot be negative");
  if (!Number.isInteger(feeBps) || feeBps < 0) throw new RangeError("feeBps must be a non-negative integer");
  if (feeBps > MAX_FEE_BPS) throw new RangeError("feeBps above the 5% cap");

  if (netTarget === 0n) return 0n;
  const D = BigInt(BPS_DENOMINATOR);
  return ((netTarget - 1n) * D) / (D - BigInt(feeBps)) + 1n;
}
