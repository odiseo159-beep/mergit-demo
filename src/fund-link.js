/**
 * Builds the "Fund this issue" link of the Mergit site.
 * @param {string} issueUrl GitHub issue URL
 * @param {string} amount Plain decimal string representation of funding amount
 * @returns {string} Mergit funding URL
 */
export function fundLink(issueUrl, amount) {
  if (
    typeof issueUrl !== "string" ||
    !/^https:\/\/github\.com\/[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+\/issues\/\d+$/.test(issueUrl)
  ) {
    throw new RangeError("issueUrl must be a https://github.com/<owner>/<repo>/issues/<number> address");
  }

  if (
    typeof amount !== "string" ||
    !/^(?:0|[1-9]\d*)(?:\.\d+)?$/.test(amount)
  ) {
    throw new RangeError('amount must be a plain decimal string like "0.0005"');
  }

  return `https://www.mergit.xyz/post?uri=${encodeURIComponent(issueUrl)}&amount=${amount}`;
}
