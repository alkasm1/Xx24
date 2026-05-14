// frontend/app.js

import {
  executeTerminalCommand
} from "./runtime/terminal.js";

import {
  connectWS,
  sendWS
} from "./ws_client.js";

import {
  routeMessage
} from "./runtime/message_router.js";

// ========================================
// WS CONNECT
// ========================================

connectWS({

  onMessage(data) {

    routeMessage(data);

    handleUIMessage(data);
  }
});

// ========================================
// TERMINAL
// ========================================

window.runTerminal =
  function () {

    const deviceId =
      document.getElementById(
        "opcodeDevice"
      )?.value?.trim();

    const command =
      document.getElementById(
        "terminalInput"
      )?.value?.trim();

    if (
      !deviceId ||
      !command
    ) {

      appendTerminal(
        "❌ missing deviceId or command"
      );

      return;
    }

    appendTerminal(
      `$ ${command}`
    );

    executeTerminalCommand({

      deviceId,

      command
    });
  };

// ========================================
// OPCODE
// ========================================

window.sendOpcode =
  function () {

    const deviceId =
      document.getElementById(
        "opcodeDevice"
      )?.value?.trim();

    const opcode =
      document.getElementById(
        "opcodeInput"
      )?.value?.trim();

    if (
      !deviceId ||
      !opcode
    ) {

      return;
    }

    sendWS({

      type:
        "ui.opcode",

      requestId:
        genId(),

      deviceId,

      opcode,

      meta: {}
    });
  };

// ========================================
// STRESS
// ========================================

function runStress(
  profile
) {

  sendWS({

    type:
      "ui.stress.run",

    profile
  });
}

window.runStress =
  runStress;

// ========================================
// STRESS BUTTONS
// ========================================

bindStressButton(
  "runLight",
  "light"
);

bindStressButton(
  "runMedium",
  "medium"
);

bindStressButton(
  "runHeavy",
  "heavy"
);

bindStressButton(
  "runExtreme",
  "extreme"
);

function bindStressButton(
  id,
  profile
) {

  const el =
    document.getElementById(id);

  if (!el) {
    return;
  }

  el.onclick =
    () =>
      runStress(profile);
}

// ========================================
// MESSAGE HANDLER
// ========================================

function handleUIMessage(
  data
) {

  if (!data) {
    return;
  }

  switch (data.type) {

    case "terminal.output":

      appendTerminal(
        data.line ||
        JSON.stringify(data)
      );

      break;

    case "snapshot":

      renderDevices(
        data.devices || []
      );

      break;

    case "log":

      appendLogs(
        data.message ||
        JSON.stringify(data)
      );

      break;
  }
}

// ========================================
// DEVICES
// ========================================

function renderDevices(
  devices
) {

  const box =
    document.getElementById(
      "devicesBox"
    );

  if (!box) {
    return;
  }

  if (!devices.length) {

    box.innerHTML =
      `
      <div class="device-item">
        No devices connected
      </div>
      `;

    return;
  }

  box.innerHTML =
    devices.map(device => `

      <div class="device-item">

        <div class="device-title">
          ${device.deviceId || "unknown"}
        </div>

        <div class="device-grid">

          <div class="device-field">
            <div class="device-label">
              IP
            </div>
            <div class="device-value">
              ${device.ip || "-"}
            </div>
          </div>

          <div class="device-field">
            <div class="device-label">
              Profile
            </div>
            <div class="device-value">
              ${device.profile || "-"}
            </div>
          </div>

          <div class="device-field">
            <div class="device-label">
              Status
            </div>
            <div class="device-value">
              ONLINE
            </div>
          </div>

        </div>

      </div>

    `).join("");
}

// ========================================
// TERMINAL OUTPUT
// ========================================

function appendTerminal(
  text
) {

  const box =
    document.getElementById(
      "terminalOutput"
    );

  if (!box) {
    return;
  }

  const line =
    document.createElement(
      "div"
    );

  line.className =
    "line";

  line.textContent =
    text;

  box.appendChild(line);

  box.scrollTop =
    box.scrollHeight;
}

// ========================================
// LOGS
// ========================================

function appendLogs(
  text
) {

  const box =
    document.getElementById(
      "logs"
    );

  if (!box) {
    return;
  }

  const line =
    document.createElement(
      "div"
    );

  line.className =
    "line";

  line.textContent =
    text;

  box.appendChild(line);

  box.scrollTop =
    box.scrollHeight;
}

// ========================================
// HELPERS
// ========================================

function genId() {

  return (
    "req_" +
    Math.random()
      .toString(36)
      .slice(2)
  );
}
