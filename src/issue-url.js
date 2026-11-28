// Reads owner, repository and issue number from a GitHub issue address.

const ISSUE = /^github\.com\/([A-Za-z0-9-]+)\/([A-Za-z0-9._-]+)\/issues\/(\d+)\/?$/;

/**
 * @param {unknown} url a GitHub issue address, with or without https://, www.,
 *   a trailing slash or a #issuecomment fragment
 * @returns {{owner: string, repo: string, number: number} | null}
 */
export function parseIssueUrl(url) {
  if (typeof url !== "string") return null;

  const text = url.trim().replace(/^https?:\/\//i, "").replace(/^www\./i, "").split("#")[0];
  const match = ISSUE.exec(text);
  if (!match) return null;

  return { owner: match[1], repo: match[2], number: Number(match[3]) };
}
