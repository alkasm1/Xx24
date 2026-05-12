import {
  handleDeviceAction
} from "../runtime/actions/device_action_click.js";

export function renderDeviceActions(
  device
) {

  if (
    !device ||
    !Array.isArray(
      device.capabilities
    )
  ) {
    return "";
  }

  return device.capabilities
    .map(opcode => {

      return `
        <button
          class="device-action-btn"
          data-device="${device.deviceId}"
          data-opcode="${opcode}"
        >
          ${opcode}
        </button>
      `;
    })
    .join("");
}

export function wireDeviceActions() {

  const buttons =
    document.querySelectorAll(
      ".device-action-btn"
    );

  buttons.forEach(btn => {

    btn.onclick = () => {

      handleDeviceAction({
        deviceId:
          btn.dataset.device,

        opcode:
          btn.dataset.opcode
      });
    };
  });
}
