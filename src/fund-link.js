// Builds the "Fund this issue" link of the Mergit site.

const ISSUE_URL = /^https:\/\/github\.com\/[A-Za-z0-9-]+\/[A-Za-z0-9._-]+\/issues\/\d+$/;
const AMOUNT = /^\d+(?:\.\d+)?$/;
const BASE = "https://www.mergit.xyz/post";

/**
 * @param {string} issueUrl https://github.com/<owner>/<repo>/issues/<number>
 * @param {string} amount a plain decimal amount of ETH, such as "0.0005"
 */
export function fundLink(issueUrl, amount) {
  if (typeof issueUrl !== "string" || !ISSUE_URL.test(issueUrl)) {
    throw new RangeError("issueUrl must be a https://github.com/<owner>/<repo>/issues/<number> address");
  }
  if (typeof amount !== "string" || !AMOUNT.test(amount)) {
    throw new RangeError('amount must be a plain decimal string such as "0.0005"');
  }

  return `${BASE}?uri=${encodeURIComponent(issueUrl)}&amount=${amount}`;
}
