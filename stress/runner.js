// stress/runner.js

const {
  loadProfile
} = require("./utils");

const {
  startLoad
} = require("./load-generator");

const Metrics =
  require("./metrics");

const {
  reportResults
} = require("./reporter");

let activeStress =
  false;

async function runStress(
  profileName
) {
  if (activeStress) {
    throw new Error(
      "Stress test already running"
    );
  }

  activeStress = true;

  try {
    const profile =
      loadProfile(
        profileName
      );

    const metrics =
      new Metrics();

    console.log(
      "🔥 Starting stress test:",
      profileName
    );

    await startLoad(
      profile,
      metrics
    );

    const results =
      metrics.finalize();

    await reportResults(
      results
    );

    console.log(
      "✅ Stress test completed:",
      profileName
    );

    return results;
  } finally {
    activeStress = false;
  }
}

module.exports = {
  runStress
};
