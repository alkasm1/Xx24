// frontend/stress-view.js

export function renderStressResults(results) {
  const box = document.getElementById("stressResults");
  if (!box) return;

  box.textContent = JSON.stringify(results, null, 2);
}
