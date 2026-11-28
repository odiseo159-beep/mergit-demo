// Checks a mergit.json before it is committed.

const ADDRESS = /^0x[0-9a-fA-F]{40}$/;
const LOGIN = /^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/;
const LOGIN_MAX = 39;
const ALLOWED = ["wallets", "funders"];

/**
 * Returns every problem with a mergit.json, in a readable form, and an empty
 * list when the file is fine. It never throws.
 * @param {unknown} config
 * @returns {string[]}
 */
export function validateMergitJson(config) {
  const problems = [];

  if (typeof config !== "object" || config === null || Array.isArray(config)) {
    return ["config must be a plain object"];
  }

  for (const key of Object.keys(config)) {
    if (!ALLOWED.includes(key)) problems.push(`unknown key: ${key}`);
  }

  if ("wallets" in config) {
    const wallets = config.wallets;
    if (typeof wallets !== "object" || wallets === null || Array.isArray(wallets)) {
      problems.push("wallets must be a plain object of login to address");
    } else {
      for (const [login, address] of Object.entries(wallets)) {
        if (!isLogin(login)) problems.push(`wallet login is not a GitHub login: ${login}`);
        if (!isAddress(address)) problems.push(`wallet address for ${login} is not 0x and 40 hex characters: ${String(address)}`);
      }
    }
  }

  if ("funders" in config) {
    const funders = config.funders;
    if (!Array.isArray(funders)) {
      problems.push("funders must be an array of addresses");
    } else {
      for (const address of funders) {
        if (!isAddress(address)) problems.push(`funder is not 0x and 40 hex characters: ${String(address)}`);
      }
    }
  }

  return problems;
}

function isLogin(value) {
  return typeof value === "string" && value.length <= LOGIN_MAX && LOGIN.test(value);
}

function isAddress(value) {
  return typeof value === "string" && ADDRESS.test(value);
}
