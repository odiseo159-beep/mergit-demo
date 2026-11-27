// Turns a fee written as a percentage into basis points.

import { MAX_FEE_BPS } from "./split.js";

/**
 * Turns a fee written as a percentage into basis points.
 * @param {string} text fee as a percentage, with or without a trailing "%"
 */
export function bpsFromPercent(text) {
  if (typeof text !== "string") throw new TypeError("text must be a string");

  const cleaned = text.trim();
  if (cleaned === "") throw new RangeError("text cannot be empty");
  if (cleaned.startsWith("-")) throw new RangeError("text cannot be negative");

  const digits = cleaned.endsWith("%") ? cleaned.slice(0, -1) : cleaned;
  const match = /^(\d+)(?:\.(\d{1,2}))?$/.exec(digits);
  if (!match) throw new RangeError("text must be a percentage with at most 2 decimals");

  const bps = Number(match[1]) * 100 + Number((match[2] ?? "").padEnd(2, "0"));
  if (bps > MAX_FEE_BPS) throw new RangeError("text is above the 5% cap");
  return bps;
}
