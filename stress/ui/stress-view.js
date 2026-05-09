// /stress/ui/stress-view.js
export function renderStressResults(results) {
  const root = document.getElementById("stress-results");
  root.innerHTML = `
    <h2>Stress Test Results</h2>
    <p>Total: ${results.total}</p>
    <p>OK: ${results.ok}</p>
    <p>Errors: ${results.errors}</p>
    <p>P50: ${results.p50} ms</p>
    <p>P90: ${results.p90} ms</p>
    <p>P99: ${results.p99} ms</p>
  `;
}
