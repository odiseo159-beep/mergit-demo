/*
 * Utility to parse a GitHub issue URL and extract the owner, repository, and issue number.
 *
 * Supported URL forms:
 *   - https://github.com/owner/repo/issues/123
 *   - http://github.com/owner/repo/issues/123
 *   - github.com/owner/repo/issues/123
 *   - www.github.com/owner/repo/issues/123
 *   - Any of the above with a trailing slash
 *   - Any of the above with a fragment like #issuecomment-456
 *
 * Returns an object { owner, repo, number } where `number` is a Number.
 * Returns null for pull‑request URLs, non‑GitHub domains, missing/invalid numbers,
 * or when the input is not a string.
 */

/**
 * Parse a GitHub issue URL.
 * @param {string} url - The URL to parse.
 * @returns {{owner:string,repo:string,number:number}|null}
 */
function parseIssueUrl(url) {
  if (typeof url !== 'string') {
    return null;
  }

  // Trim whitespace
  let cleaned = url.trim();

  // Remove protocol (http:// or https://)
  cleaned = cleaned.replace(/^https?:\/\//i, '');

  // Remove optional www.
  cleaned = cleaned.replace(/^www\./i, '');

  // Strip fragment identifier if present
  const hashIndex = cleaned.indexOf('#');
  if (hashIndex !== -1) {
    cleaned = cleaned.substring(0, hashIndex);
  }

  // Remove trailing slashes
  cleaned = cleaned.replace(/\/+$/g, '');

  // Expected pattern: github.com/:owner/:repo/issues/:number
  const issueRegex = /^github\.com\/([^\/]+)\/([^\/]+)\/issues\/(\d+)$/i;
  const match = cleaned.match(issueRegex);

  if (!match) {
    // Not a matching issue URL (could be a pull request, other domain, etc.)
    return null;
  }

  const [, owner, repo, numberStr] = match;
  const number = Number(numberStr);

  // Defensive check – ensure number is a valid integer
  if (!Number.isInteger(number) || number <= 0) {
    return null;
  }

  return { owner, repo, number };
}

module.exports = { parseIssueUrl };
