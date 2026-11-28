// Splits a batch of bounties and adds the parts back up.

import { split } from "./split.js";

/**
 * Splits every amount with split() and sums the payouts and the fees.
 * @param {bigint[]} amounts gross amounts locked in the escrow, in wei
 * @param {number} feeBps protocol fee in basis points
 */
export function splitMany(amounts, feeBps) {
  if (!Array.isArray(amounts)) throw new TypeError("amounts must be an array");

  const items = [];
  let totalPayout = 0n;
  let totalFee = 0n;

  for (const amount of amounts) {
    const item = split(amount, feeBps);
    items.push(item);
    totalPayout += item.payout;
    totalFee += item.fee;
  }

  return { items, totalPayout, totalFee };
}
