// stress/reporter.js

const fs = require("fs");

async function reportResults(results) {
  fs.writeFileSync("./stress/results.json", JSON.stringify(results, null, 2));
  console.log("📄 Stress results saved.");
}

module.exports = { reportResults };
