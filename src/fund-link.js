// src/fund-link.js
/**
 * Builds the "Fund this issue" link for the Mergit site.
 *
 * @param {string} issueUrl - A GitHub issue URL of the form
 *   https://github.com/<owner>/<repo>/issues/<number>
 * @param {string} amount - A plain decimal string representing the amount to fund,
 *   e.g., "0.0005".
 * @returns {string} The fully‑qualified Mergit funding URL.
 * @throws {RangeError} If `issueUrl` does not match the expected pattern or if
 *   `amount` is not a plain decimal string.
 */
function fundLink(issueUrl, amount) {
  // Validate the GitHub issue URL.
  const urlPattern = /^https:\/\/github\.com\/[^\/]+\/[^\/]+\/issues\/\d+$/;
  if (!urlPattern.test(issueUrl)) {
    throw new RangeError('Invalid issue URL');
  }

  // Validate the amount – must be a plain decimal string (e.g., "0.0005").
  const amountPattern = /^\d+(?:\.\d+)?$/;
  if (!amountPattern.test(amount)) {
    throw new RangeError('Invalid amount');
  }

  const encodedIssueUrl = encodeURIComponent(issueUrl);
  return `https://www.mergit.xyz/post?uri=${encodedIssueUrl}&amount=${amount}`;
}

// Export for ES‑module environments.
export { fundLink };

// Export for CommonJS environments (e.g., when using require()).
module.exports = { fundLink };
