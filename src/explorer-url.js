const BASE_URL = "https://sepolia-explorer.giwa.io";

/**
 * Builds a GIWA Sepolia explorer URL for a transaction, address, or block.
 * @param {"tx"|"address"|"block"} kind explorer resource type
 * @param {string|number|bigint} value resource identifier
 */
export function explorerUrl(kind, value) {
  if (kind !== "tx" && kind !== "address" && kind !== "block") {
    throw new TypeError("unknown explorer resource kind");
  }

  if (kind === "tx" || kind === "address") {
    const length = kind === "tx" ? 64 : 40;
    if (typeof value !== "string" || !new RegExp(`^0x[0-9a-fA-F]{${length}}$`).test(value)) {
      throw new RangeError(`invalid ${kind}`);
    }
    return `${BASE_URL}/${kind}/${value.toLowerCase()}`;
  }

  if (
    (typeof value !== "number" && typeof value !== "bigint") ||
    (typeof value === "number" && (!Number.isInteger(value) || value < 0)) ||
    (typeof value === "bigint" && value < 0n)
  ) {
    throw new RangeError("invalid block");
  }

  return `${BASE_URL}/block/${value}`;
}
