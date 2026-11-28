/**
 * Returns the short form of an EVM address: first 6 chars, ellipsis, last 4 chars.
 * @param {string} address 0x-prefixed 40-character hex EVM address
 * @returns {string} Shortened address format (e.g. "0x23E8…7686")
 */
export function shortAddress(address) {
  if (
    typeof address !== "string" ||
    !/^0x[0-9a-fA-F]{40}$/.test(address)
  ) {
    throw new TypeError("address must be a full EVM address (0x and 40 hex characters)");
  }

  return `${address.slice(0, 6)}\u2026${address.slice(-4)}`;
}
