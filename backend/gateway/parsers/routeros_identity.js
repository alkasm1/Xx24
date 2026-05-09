// backend/gateway/parsers/routeros_identity.js

module.exports = function parseRouterOSIdentity(result) {
  const line = result.stdout.split("\n")[0] || "";
  return { identity: line.trim() };
};
