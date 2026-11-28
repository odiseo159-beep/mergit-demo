// Validation for mergit.json, run before the file is committed.
//
// The rules mirror what the Mergit agent expects when it reads the wallet
// registry: a plain object with an optional `wallets` map (GitHub login ->
// payout address) and an optional `funders` array of addresses. Validation
// never throws; it returns a list of human-readable problems, empty when the
// config is fine.

const MAX_LOGIN_LENGTH = 39;

// A GitHub login: 1-39 characters, letters or digits, single hyphens allowed
// between alphanumerics, and it must not start or end with a hyphen.
const LOGIN_PATTERN = /^[a-z0-9](?:[a-z0-9]|-(?=[a-z0-9])){0,38}$/i;

// An EVM address: 0x followed by exactly 40 hexadecimal characters.
const ADDRESS_PATTERN = /^0x[0-9a-fA-F]{40}$/;

const ALLOWED_KEYS = new Set(["wallets", "funders"]);

function isPlainObject(value) {
  if (value === null || typeof value !== "object") return false;
  if (Array.isArray(value)) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

function isLogin(value) {
  if (typeof value !== "string") return false;
  if (value.length < 1 || value.length > MAX_LOGIN_LENGTH) return false;
  return LOGIN_PATTERN.test(value);
}

function isAddress(value) {
  return typeof value === "string" && ADDRESS_PATTERN.test(value);
}

/**
 * Validate a mergit.json config object.
 * @param {unknown} config the parsed mergit.json contents
 * @returns {string[]} readable problems; empty when the config is valid
 */
export function validateMergitJson(config) {
  const problems = [];

  if (!isPlainObject(config)) {
    problems.push("config must be a plain object");
    return problems;
  }

  for (const key of Object.keys(config)) {
    if (!ALLOWED_KEYS.has(key)) {
      problems.push(`unknown key "${key}": only "wallets" and "funders" are allowed`);
    }
  }

  if (Object.prototype.hasOwnProperty.call(config, "wallets")) {
    const wallets = config.wallets;
    if (!isPlainObject(wallets)) {
      problems.push('"wallets" must be an object mapping GitHub logins to addresses');
    } else {
      for (const [login, address] of Object.entries(wallets)) {
        if (!isLogin(login)) {
          problems.push(`invalid GitHub login "${login}" in "wallets"`);
        }
        if (!isAddress(address)) {
          problems.push(
            `invalid address for "${login}": expected 0x followed by 40 hex characters`,
          );
        }
      }
    }
  }

  if (Object.prototype.hasOwnProperty.call(config, "funders")) {
    const funders = config.funders;
    if (!Array.isArray(funders)) {
      problems.push('"funders" must be an array of addresses');
    } else {
      funders.forEach((address, index) => {
        if (!isAddress(address)) {
          problems.push(
            `invalid address at "funders"[${index}]: expected 0x followed by 40 hex characters`,
          );
        }
      });
    }
  }

  return problems;
}