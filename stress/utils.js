// stress/utils.js

const fs = require("fs");

function loadProfile(name) {
  const path = `./stress/profiles/${name}.json`;
  return JSON.parse(fs.readFileSync(path, "utf8"));
}

module.exports = { loadProfile };
