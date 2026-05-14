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

// ------------------------------------
// CONNECT WS
// ------------------------------------

connectWS({
  onMessage:
    handleMessage
});

// ------------------------------------
// HANDLE MESSAGES
// ------------------------------------

function handleMessage(
  data
) {

  routeMessage(data);

  if (
    data.type ===
    "runtime.snapshot"
  ) {

    renderDevices(
      data.devices || []
    );
  }

  if (
    data.type ===
    "runtime.log"
  ) {

    appendLog(
      data.message
    );
  }

  if (
    data.type ===
    "terminal.output"
  ) {

    const box =
      document.getElementById(
        "terminalOutput"
      );

    box.textContent +=
      data.line + "\n";
  }

  if (
    data.type ===
    "stress.result"
  ) {

    document.getElementById(
      "stressResults"
    ).textContent =
      JSON.stringify(
        data,
        null,
        2
      );
  }
}

// ------------------------------------
// OPCODE
// ------------------------------------

window.sendOpcode =
  function () {

    const deviceId =
      document.getElementById(
        "opcodeDevice"
      ).value;

    const opcode =
      document.getElementById(
        "opcodeInput"
      ).value;

    sendWS({

      type:
        "ui.opcode",

      requestId:
        "req_" +
        Date.now(),

      deviceId,

      opcode
    });
  };

// ------------------------------------
// TERMINAL
// ------------------------------------

window.runTerminal =
  function () {

    const deviceId =
      document.getElementById(
        "opcodeDevice"
      ).value;

    const command =
      document.getElementById(
        "terminalInput"
      ).value;

    const box =
      document.getElementById(
        "terminalOutput"
      );

    box.textContent =
      "$ " +
      command +
      "\n\n";

    executeTerminalCommand({

      deviceId,
      command
    });
  };

// ------------------------------------
// STRESS
// ------------------------------------

function runStress(
  profile
) {

  const box =
    document.getElementById(
      "stressResults"
    );

  box.textContent =
    "Running stress profile: " +
    profile +
    "...";

  sendWS({

    type:
      "ui.stress.run",

    profile
  });
}

document
  .getElementById(
    "runLight"
  )
  ?.addEventListener(
    "click",
    () =>
      runStress(
        "light"
      )
  );

document
  .getElementById(
    "runMedium"
  )
  ?.addEventListener(
    "click",
    () =>
      runStress(
        "medium"
      )
  );

document
  .getElementById(
    "runHeavy"
  )
  ?.addEventListener(
    "click",
    () =>
      runStress(
        "heavy"
      )
  );

document
  .getElementById(
    "runExtreme"
  )
  ?.addEventListener(
    "click",
    () =>
      runStress(
        "extreme"
      )
  );

// ------------------------------------
// DEVICES RENDER
// ------------------------------------

function renderDevices(
  devices
) {

  const box =
    document.getElementById(
      "devicesBox"
    );

  if (
    !devices.length
  ) {

    box.innerHTML =
      `
      <div class="runtime-terminal">
        No runtime devices detected.
      </div>
      `;

    return;
  }

  box.innerHTML =
    devices.map(device => {

      return `
        <div class="device-item">

          <div class="device-title">
            ${device.deviceId || "Unknown"}
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
                Port
              </div>
              <div class="device-value">
                ${device.port || "-"}
              </div>
            </div>

            <div class="device-field">
              <div class="device-label">
                Method
              </div>
              <div class="device-value">
                ${device.method || "-"}
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

          </div>

        </div>
      `;
    }).join("");
}

// ------------------------------------
// LOGS
// ------------------------------------

function appendLog(
  line
) {

  const box =
    document.getElementById(
      "logs"
    );

  box.textContent +=
    line + "\n";

  box.scrollTop =
    box.scrollHeight;
}
