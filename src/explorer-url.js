// Builds links into the GIWA Sepolia block explorer, the explorer receipts
// point to.

const BASE_URL = "https://sepolia-explorer.giwa.io";

const TX_HASH_RE = /^0x[0-9a-fA-F]{64}$/;
const ADDRESS_RE = /^0x[0-9a-fA-F]{40}$/;

/**
 * Builds the GIWA Sepolia explorer link for a transaction, an address or a
 * block.
 * @param {"tx"|"address"|"block"} kind what value identifies
 * @param {string|number|bigint} value the hash, address or block number
 */
export function explorerUrl(kind, value) {
  if (kind === "tx") {
    if (typeof value !== "string" || !TX_HASH_RE.test(value)) {
      throw new RangeError("tx hash must be 0x followed by 64 hex characters");
    }
    return `${BASE_URL}/tx/${value.toLowerCase()}`;
  }

  if (kind === "address") {
    if (typeof value !== "string" || !ADDRESS_RE.test(value)) {
      throw new RangeError("address must be 0x followed by 40 hex characters");
    }
    return `${BASE_URL}/address/${value.toLowerCase()}`;
  }

  if (kind === "block") {
    const isWholeNumber = typeof value === "number" && Number.isInteger(value) && value >= 0;
    const isWholeBigint = typeof value === "bigint" && value >= 0n;
    if (!isWholeNumber && !isWholeBigint) {
      throw new RangeError("block must be a whole number (number or bigint) that is >= 0");
    }
    return `${BASE_URL}/block/${value}`;
  }

  throw new TypeError(`unknown kind: ${kind}`);
}
