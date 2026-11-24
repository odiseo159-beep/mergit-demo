export function validateMergitJson(config) {
  const problems = [];
  if (!config || typeof config !== 'object' || Array.isArray(config)) {
    problems.push("config must be a plain object");
    return problems;
  }
  const allowedKeys = ['wallets', 'funders'];
  for (const key of Object.keys(config)) {
    if (!allowedKeys.includes(key)) problems.push(`Invalid key: ${key}`);
  }
  if ('wallets' in config) {
    const wallets = config.wallets;
    if (!wallets || typeof wallets !== 'object' || Array.isArray(wallets)) {
      problems.push("wallets must be a plain object");
    } else {
      for (const [login, address] of Object.entries(wallets)) {
        if (login.length < 1 || login.length > 39 || !/^[a-zA-Z0-9](?:-?[a-zA-Z0-9])*$/.test(login)) {
          problems.push(`Invalid GitHub login: ${login}`);
        }
        if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
          problems.push(`Invalid address for ${login}: ${address}`);
        }
      }
    }
  }
  if ('funders' in config) {
    const funders = config.funders;
    if (!Array.isArray(funders)) {
      problems.push("funders must be an array");
    } else {
      for (const address of funders) {
        if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
          problems.push(`Invalid funder address: ${address}`);
        }
      }
    }
  }
  return problems;
}
