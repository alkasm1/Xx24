// backend/gateway/parsers/json.js

module.exports = function parseJSON(result) {
  try {
    return JSON.parse(result.stdout);
  } catch {
    return { error: "Invalid JSON output", raw: result.stdout };
  }
};
