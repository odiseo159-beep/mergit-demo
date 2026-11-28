// The GIWA Sepolia explorer link that a receipt points to.

const BASE = "https://sepolia-explorer.giwa.io";
const TX = /^0x[0-9a-fA-F]{64}$/;
const ADDRESS = /^0x[0-9a-fA-F]{40}$/;

/**
 * @param {"tx"|"address"|"block"} kind
 * @param {string|number|bigint} value
 */
export function explorerUrl(kind, value) {
  if (kind === "tx") {
    if (typeof value !== "string" || !TX.test(value)) {
      throw new RangeError("a transaction hash is 0x and 64 hex characters");
    }
    return `${BASE}/tx/${value.toLowerCase()}`;
  }

  if (kind === "address") {
    if (typeof value !== "string" || !ADDRESS.test(value)) {
      throw new RangeError("an address is 0x and 40 hex characters");
    }
    return `${BASE}/address/${value.toLowerCase()}`;
  }

  if (kind === "block") {
    if (typeof value === "bigint") {
      if (value < 0n) throw new RangeError("a block number cannot be negative");
      return `${BASE}/block/${value}`;
    }
    if (typeof value !== "number" || !Number.isInteger(value) || value < 0) {
      throw new RangeError("a block number is a whole number of at least 0");
    }
    return `${BASE}/block/${value}`;
  }

  throw new TypeError(`unknown kind: ${String(kind)}`);
}
