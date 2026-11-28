// The short form of an address, the way the Mergit site shows it.

const ADDRESS = /^0x[0-9a-fA-F]{40}$/;
const HEAD = 6;
const TAIL = 4;
const ELLIPSIS = "\u2026";

/**
 * Shortens a full address to its first 6 characters, an ellipsis and its last 4.
 * @param {string} address `0x` and 40 hex characters
 */
export function shortAddress(address) {
  if (typeof address !== "string" || !ADDRESS.test(address)) {
    throw new TypeError("address must be 0x and 40 hex characters");
  }
  return `${address.slice(0, HEAD)}${ELLIPSIS}${address.slice(-TAIL)}`;
}
