// A Markdown table of what each bounty pays, built on split.

import { split } from "./split.js";

/**
 * Renders a Markdown table of the fee and payout for each gross amount.
 *
 * The first line is the header, the second the separator, then one row per
 * amount, in order. Lines are joined with "\n" and there is no trailing
 * newline, so an empty list yields only the two header lines.
 * @param {bigint[]} amounts gross amounts in wei, one per row
 * @param {number} feeBps protocol fee in basis points
 */
export function feeTable(amounts, feeBps) {
  if (!Array.isArray(amounts)) throw new TypeError("amounts must be an array");

  const lines = ["| Amount (wei) | Fee (wei) | Payout (wei) |", "|---|---|---|"];
  for (const amount of amounts) {
    const { fee, payout } = split(amount, feeBps);
    lines.push(`| ${amount} | ${fee} | ${payout} |`);
  }
  return lines.join("\n");
}
