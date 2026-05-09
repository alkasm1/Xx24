// /stress/reporter.js
import fs from 'fs';

export async function reportResults(results) {
  const path = './stress/results.json';
  fs.writeFileSync(path, JSON.stringify(results, null, 2));
  console.log(`📄 Results saved to ${path}`);
}
