// backend/gateway/parsers/index.js

const text = require("./text");
const json = require("./json");
const routerosIdentity = require("./routeros_identity");

const parsers = {
  text,
  json,
  "routeros.identity": routerosIdentity
};

function parseResult(parserName, result) {
  const fn = parsers[parserName] || parsers.text;
  return fn(result);
}

module.exports = { parseResult };
