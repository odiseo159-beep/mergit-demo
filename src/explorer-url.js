// Builds the GIWA Sepolia explorer link that receipts point to.

const EXPLORER_BASE = "https://sepolia-explorer.giwa.io";

/**
 * Builds the GIWA Sepolia explorer link for a tx, an address or a block.
 * @param {string} kind "tx", "address" or "block"
 * @param {string|number|bigint} value tx hash, address or block number
 */
export function explorerUrl(kind, value) {
  if (kind === "tx") {
    if (typeof value !== "string" || !/^0x[0-9a-fA-F]{64}$/.test(value)) {
      throw new RangeError("tx hash must be 0x plus 64 hex characters");
    }
    return `${EXPLORER_BASE}/tx/${value.toLowerCase()}`;
  }
  if (kind === "address") {
    if (typeof value !== "string" || !/^0x[0-9a-fA-F]{40}$/.test(value)) {
      throw new RangeError("address must be 0x plus 40 hex characters");
    }
    return `${EXPLORER_BASE}/address/${value.toLowerCase()}`;
  }
  if (kind === "block") {
    if (typeof value === "number") {
      if (!Number.isInteger(value) || value < 0) {
        throw new RangeError("block must be a whole number >= 0");
      }
    } else if (typeof value === "bigint") {
      if (value < 0n) throw new RangeError("block must be >= 0");
    } else {
      throw new RangeError("block must be a whole number >= 0");
    }
    return `${EXPLORER_BASE}/block/${value.toString()}`;
  }
  throw new TypeError(`unknown kind: ${kind}`);
}
