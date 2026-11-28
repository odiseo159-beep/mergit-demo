import { split } from "./split.js";

/**
 * Splits a list of bounties and adds them up.
 * @param {bigint[]} amounts list of gross amounts in wei
 * @param {number} feeBps protocol fee in basis points
 * @returns {{ items: Array<{ payout: bigint, fee: bigint }>, totalPayout: bigint, totalFee: bigint }}
 */
export function splitMany(amounts, feeBps) {
  if (!Array.isArray(amounts)) {
    throw new TypeError("amounts must be an array");
  }

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
