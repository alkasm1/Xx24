// /stress/runner.js
import { loadProfile } from './utils.js';
import { startLoad } from './load-generator.js';
import { Metrics } from './metrics.js';
import { reportResults } from './reporter.js';

export async function runStress(profileName) {
  const profile = loadProfile(profileName);
  const metrics = new Metrics();

  console.log(`🚀 Starting stress test: ${profileName}`);

  await startLoad(profile, metrics);

  const results = metrics.finalize();
  await reportResults(results);

  console.log(`✅ Stress test completed: ${profileName}`);
  return results;
}
