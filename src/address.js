// Is this string an EVM address?

const ADDRESS = /^0x[0-9a-fA-F]{40}$/;

/**
 * Says whether a string is `0x` and 40 hex characters, in any letter case.
 * It never throws: anything that is not a string is simply not an address.
 * @param {unknown} text
 */
export function isAddress(text) {
  return typeof text === "string" && ADDRESS.test(text);
}
