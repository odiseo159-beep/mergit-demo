// Bounty payout maths for batch operations, mirroring MergitEscrow.
import { split, BPS_DENOMINATOR, MAX_FEE_BPS } from "./split.js";

/**
 * Splits a batch of bounties into individual payouts and fees, and computes totals.
 * @param {bigint[]} amounts array of gross amounts locked in escrow, in wei
 * @param {number} feeBps protocol fee in basis points
 * @returns {{ items: { payout: bigint, fee: bigint }[], totalPayout: bigint, totalFee: bigint }}
 */
export function splitMany(amounts, feeBps) {
  if (!Array.isArray(amounts)) {
    throw new TypeError("amounts must be an array");
  }
  if (!Number.isInteger(feeBps) || feeBps < 0) {
    throw new RangeError("feeBps must be a non-negative integer");
  }
  if (feeBps > MAX_FEE_BPS) {
    throw new RangeError("feeBps above the 5% cap");
  }

  const items = [];
  let totalPayout = 0n;
  let totalFee = 0n;

  for (const amount of amounts) {
    // Reuse split which validates each amount
    const { payout, fee } = split(amount, feeBps);
    items.push({ payout, fee });
    totalPayout += payout;
    totalFee += fee;
  }

  return { items, totalPayout, totalFee };
}