// Builds GIWA Sepolia block explorer URLs for transactions, addresses, and blocks.

const BASE_URL = "https://sepolia-explorer.giwa.io";

const TX_HEX_RE = /^0x[0-9a-fA-F]{64}$/;
const ADDRESS_HEX_RE = /^0x[0-9a-fA-F]{40}$/;

/**
 * Validates and lowercases a fixed-length 0x-prefixed hex value.
 * @param {unknown} value
 * @param {RegExp} pattern
 * @param {string} label
 * @returns {string}
 */
function formatHex(value, pattern, label) {
  if (typeof value !== "string" || !pattern.test(value)) {
    throw new RangeError(`${label} must be a 0x-prefixed hex string`);
  }
  return value.toLowerCase();
}

/**
 * Validates a non-negative integer block number (number or bigint) and returns its decimal string.
 * @param {unknown} value
 * @returns {string}
 */
function formatBlock(value) {
  if (typeof value === "bigint") {
    if (value >= 0n) return value.toString();
  } else if (typeof value === "number") {
    if (Number.isSafeInteger(value) && value >= 0) return value.toString();
  }
  throw new RangeError("block must be a non-negative integer");
}

const FORMATTERS = new Map([
  ["tx", (value) => formatHex(value, TX_HEX_RE, "tx hash (64 hex chars)")],
  ["address", (value) => formatHex(value, ADDRESS_HEX_RE, "address (40 hex chars)")],
  ["block", formatBlock],
]);

/**
 * Returns the GIWA Sepolia explorer URL for a transaction, address, or block.
 * @param {"tx" | "address" | "block"} kind resource type
 * @param {string | number | bigint} value tx hash, address, or block number
 * @returns {string}
 */
export function explorerUrl(kind, value) {
  if (typeof kind !== "string" || !FORMATTERS.has(kind)) {
    throw new TypeError('kind must be "tx", "address", or "block"');
  }
  const normalized = FORMATTERS.get(kind)(value);
  return `${BASE_URL}/${kind}/${normalized}`;
}
