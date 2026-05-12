// frontend/renderers/stress_renderer.js

const stressResults =
  document.getElementById(
    "stressResults"
  );

export function renderStressResults(
  results
) {

  if (!stressResults) {
    return;
  }

  stressResults.textContent =
    JSON.stringify(
      results,
      null,
      2
    );
}
