// Reads what a pull request description claims: the issues it closes and the
// bounty it points at.

const KEYWORDS = /(?:closes|fixes|resolves)\s*:?\s*((?:#\d+[\s,]*(?:and\s+)?)+)/gi;
const ISSUE = /#(\d+)/g;
const BOUNTY_LINE = /^\s*bounty\s*:\s*#(\d+)\s*$/i;

/**
 * @param {string} body pull request description
 * @returns {{closes: number[], bounty: number|null}}
 */
export function parseClaim(body) {
  if (typeof body !== "string") throw new TypeError("body must be a string");

  const closes = [];
  let bounty = null;
  let inFence = false;

  for (const line of body.split(/\r?\n/)) {
    if (line.trimStart().startsWith("```")) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    if (bounty === null) {
      const claim = BOUNTY_LINE.exec(line);
      if (claim) bounty = Number(claim[1]);
    }

    for (const match of line.matchAll(KEYWORDS)) {
      for (const issue of match[1].matchAll(ISSUE)) {
        const number = Number(issue[1]);
        if (!closes.includes(number)) closes.push(number);
      }
    }
  }

  return { closes, bounty };
}
