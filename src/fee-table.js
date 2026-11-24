import { split } from './split.js';

export function feeTable(amounts, feeBps) {
  if (!Array.isArray(amounts)) throw new TypeError("amounts must be an array");
  
  const lines = [
    "| Amount (wei) | Fee (wei) | Payout (wei) |",
    "|---|---|---|"
  ];
  
  for (const amount of amounts) {
    const { payout, fee } = split(amount, feeBps);
    lines.push(`| ${amount} | ${fee} | ${payout} |`);
  }
  
  return lines.join("\n");
}
