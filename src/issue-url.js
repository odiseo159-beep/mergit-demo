/**
 * Reads owner, repository and issue number from a GitHub issue address.
 * @param {string} url GitHub issue URL
 * @returns {{ owner: string, repo: string, number: number } | null}
 */
export function parseIssueUrl(url) {
  if (typeof url !== "string") {
    return null;
  }

  const trimmed = url.trim();
  const match = trimmed.match(
    /^(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)\/issues\/(\d+)(?:\/)?(?:#[^\s]*)?$/
  );

  if (!match) {
    return null;
  }

  const [, owner, repo, numStr] = match;
  return {
    owner,
    repo,
    number: Number(numStr),
  };
}
