// frontend/renderers/devices_renderer.js

const devicesBox =
  document.getElementById(
    "devicesBox"
  );

export function renderDevices(
  snapshot
) {

  if (!devicesBox) {
    return;
  }

  devicesBox.textContent =
    JSON.stringify(
      snapshot,
      null,
      2
    );
}
