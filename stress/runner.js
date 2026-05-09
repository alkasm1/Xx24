// stress/runner.js

const { loadProfile } = require("./utils");
const { startLoad } = require("./load-generator");
const Metrics = require("./metrics");
const { reportResults } = require("./reporter");

async function runStress(profileName) {
  const profile = loadProfile(profileName);
  const metrics = new Metrics();

  console.log("🔥 Starting stress test:", profileName);

  await startLoad(profile, metrics);

  const results = metrics.finalize();
  await reportResults(results);

  console.log("✅ Stress test completed:", profileName);
  return results;
}

module.exports = { runStress };
