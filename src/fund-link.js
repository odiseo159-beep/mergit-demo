export function fundLink(issueUrl, amount) {
  if (typeof issueUrl !== 'string' || !/^https:\/\/github\.com\/[^\/]+\/[^\/]+\/issues\/\d+$/.test(issueUrl)) {
    throw new RangeError("Invalid issueUrl");
  }
  if (typeof amount !== 'string' || !/^\d+(\.\d+)?$/.test(amount)) {
    throw new RangeError("Invalid amount");
  }
  return `https://www.mergit.xyz/post?uri=${encodeURIComponent(issueUrl)}&amount=${amount}`;
}
