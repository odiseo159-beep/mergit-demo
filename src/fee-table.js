// A Markdown table of what each bounty pays.

import { split } from "./split.js";

const HEADER = "| Amount (wei) | Fee (wei) | Payout (wei) |";
const SEPARATOR = "|---|---|---|";

/**
 * @param {bigint[]} amounts gross amounts locked in the escrow, in wei
 * @param {number} feeBps protocol fee in basis points
 */
export function feeTable(amounts, feeBps) {
  if (!Array.isArray(amounts)) throw new TypeError("amounts must be an array");

  const lines = [HEADER, SEPARATOR];
  for (const amount of amounts) {
    const { payout, fee } = split(amount, feeBps);
    lines.push(`| ${amount} | ${fee} | ${payout} |`);
  }

  return lines.join("\n");
}
