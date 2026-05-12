import {
  renderDeviceActions,
  wireDeviceActions
} from "./device_actions_renderer.js";

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

  const devices =
    snapshot.devices || [];

  devicesBox.innerHTML =
    devices.map(device => {

      return `
        <div class="device-card">

          <div class="device-header">

            <div>
              <strong>
                ${device.deviceId}
              </strong>
            </div>

            <div>
              ${device.status}
            </div>

          </div>

          <div class="device-meta">

            <div>
              Profile:
              ${device.profile}
            </div>

            <div>
              Vendor:
              ${device.vendor}
            </div>

            <div>
              Method:
              ${device.method}
            </div>

          </div>

          <div class="device-actions">

            ${renderDeviceActions(
              device
            )}

          </div>

        </div>
      `;
    }).join("");

  wireDeviceActions();
}
