/**
 * Reads which issues and which bounty a pull request description points at.
 * @param {string} body Pull request description body
 * @returns {{ closes: number[], bounty: number | null }}
 */
export function parseClaim(body) {
  if (typeof body !== "string") {
    throw new TypeError("body must be a string");
  }

  // Filter out lines inside fenced code blocks (between ```)
  const lines = body.split(/\r?\n/);
  const activeLines = [];
  let inCodeBlock = false;

  for (const line of lines) {
    if (line.trim().startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (!inCodeBlock) {
      activeLines.push(line);
    }
  }

  const text = activeLines.join("\n");
  const closes = [];
  const seen = new Set();

  // Match Closes, Fixes, Resolves (case-insensitive) followed by #<number>
  const closesRegex = /\b(?:closes|fixes|resolves)\s*:?\s*#(\d+)/gi;
  let match;
  while ((match = closesRegex.exec(text)) !== null) {
    const num = Number(match[1]);
    if (!seen.has(num)) {
      seen.add(num);
      closes.push(num);
    }
  }

  // First Bounty: #N line, or null
  let bounty = null;
  for (const line of activeLines) {
    const bountyMatch = line.match(/^\s*bounty\s*:\s*#(\d+)/i);
    if (bountyMatch) {
      bounty = Number(bountyMatch[1]);
      break;
    }
  }

  return { closes, bounty };
}
