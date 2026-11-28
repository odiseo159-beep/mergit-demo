// The GIWA Sepolia explorer link a receipt points to, for a tx, an address or a block.
// Used for links like "view the payout" next to a payment on a builder's record.

const EXPLORER = "https://sepolia-explorer.giwa.io";

const TX_HASH = /^0x[0-9a-fA-F]{64}$/;
const ADDRESS = /^0x[0-9a-fA-F]{40}$/;

/**
 * @param {"tx" | "address" | "block"} kind what the value identifies
 * @param {string | number | bigint} value the hash, the address or the block number
 * @returns {string} the explorer link
 */
export function explorerUrl(kind, value) {
  if (kind === "tx") {
    if (typeof value !== "string" || !TX_HASH.test(value)) {
      throw new RangeError("a tx hash must be 0x followed by 64 hex characters");
    }
    return `${EXPLORER}/tx/${value.toLowerCase()}`;
  }

  if (kind === "address") {
    if (typeof value !== "string" || !ADDRESS.test(value)) {
      throw new RangeError("an address must be 0x followed by 40 hex characters");
    }
    return `${EXPLORER}/address/${value.toLowerCase()}`;
  }

  if (kind === "block") {
    if (typeof value === "bigint") {
      if (value < 0n) throw new RangeError("a block number cannot be negative");
      return `${EXPLORER}/block/${value}`;
    }
    if (typeof value === "number") {
      if (!Number.isInteger(value)) throw new RangeError("a block number must be a whole number");
      if (value < 0) throw new RangeError("a block number cannot be negative");
      return `${EXPLORER}/block/${value}`;
    }
    throw new RangeError("a block number must be a number or a bigint");
  }

  throw new TypeError(`unknown kind: ${String(kind)}`);
}
