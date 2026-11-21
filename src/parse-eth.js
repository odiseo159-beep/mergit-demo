/**
 * Convert an ETH amount expressed as a decimal string to wei.
 *
 * @param {string} text - Decimal ETH amount (e.g. "1", "0.0005", "1.000000000000000001").
 * @returns {bigint} Wei representation of the amount.
 * @throws {TypeError} If `text` is not a string.
 * @throws {RangeError} If the string is empty, contains invalid characters, spaces, exponent notation,
 *                      a negative sign, more than 18 decimal places, or any other malformed format.
 */
export function parseEth(text) {
  // Type validation
  if (typeof text !== "string") {
    throw new TypeError("parseEth expects a string argument");
  }

  // Basic range checks
  if (text.length === 0) {
    throw new RangeError("Empty string is not a valid ETH amount");
  }
  if (text.includes(" ")) {
    throw new RangeError("Spaces are not allowed in the ETH amount");
  }
  if (text.includes("e") || text.includes("E")) {
    throw new RangeError("Exponent notation is not supported");
  }
  if (text.startsWith("-")) {
    throw new RangeError("Negative amounts are not allowed");
  }

  // Split integer and fractional parts
  const parts = text.split(".");
  if (parts.length > 2) {
    throw new RangeError("Invalid format: more than one decimal point");
  }

  const intPart = parts[0] ?? ""; // may be empty for ".5"
  const fracPart = parts[1] ?? "";

  // Validate characters (only digits allowed)
  const digitRegex = /^\d*$/;
  if (!digitRegex.test(intPart) || !digitRegex.test(fracPart)) {
    throw new RangeError("Invalid characters in ETH amount");
  }

  // Fractional precision limit (18 decimals = 1 wei)
  if (fracPart.length > 18) {
    throw new RangeError("Too many decimal places; maximum is 18");
  }

  const WEI_PER_ETH = 10n ** 18n;

  // Convert integer part to wei
  const intWei = intPart.length === 0 ? 0n : BigInt(intPart) * WEI_PER_ETH;

  // Convert fractional part to wei (right‑pad with zeros to 18 digits)
  const fracWei =
    fracPart.length === 0
      ? 0n
      : BigInt(fracPart.padEnd(18, "0"));

  return intWei + fracWei;
}
