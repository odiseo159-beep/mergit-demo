// src/split-many.js
// Implements batch splitting of bounty amounts using the existing `split` utility.
// Returns an object containing the individual split results and aggregated totals.

import { split } from "./split.js";

/**
 * Split a list of bounty amounts and aggregate the results.
 *
 * @param {Array<bigint|number|string>} amounts - An array of amounts to split. Each element is passed to `split`.
 * @param {number} feeBps - Fee in basis points (e.g., 250 = 2.5%).
 * @returns {{ items: Array<{ payout: bigint, fee: bigint }>, totalPayout: bigint, totalFee: bigint }}
 * @throws {TypeError} If `amounts` is not an array or if any amount/fee is invalid (delegated to `split`).
 */
export function splitMany(amounts, feeBps) {
  if (!Array.isArray(amounts)) {
    throw new TypeError("amounts must be an array");
  }

  const items = amounts.map((amt) => split(amt, feeBps));

  const totalPayout = items.reduce((acc, cur) => acc + cur.payout, 0n);
  const totalFee = items.reduce((acc, cur) => acc + cur.fee, 0n);

  return { items, totalPayout, totalFee };
}
