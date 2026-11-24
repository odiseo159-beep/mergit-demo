export function parseIssueUrl(url) {
  if (typeof url !== 'string') return null;
  const match = url.match(/^(?:https?:\/\/)?(?:www\.)?github\.com\/([^\/]+)\/([^\/]+)\/issues\/(\d+)(?:\/)?(?:#.*)?$/);
  if (!match) return null;
  return {
    owner: match[1],
    repo: match[2],
    number: Number(match[3])
  };
}
