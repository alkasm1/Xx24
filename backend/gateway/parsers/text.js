// backend/gateway/parsers/text.js

module.exports = function parseText(result) {
  return result.stdout.trim();
};
