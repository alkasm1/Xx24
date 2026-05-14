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
// CONFIG
// ========================================

// ضع IP الجهاز الذي يعمل عليه Gateway
// مثال:
// 192.168.1.10
// 10.0.0.5
const GATEWAY_HOST = "192.168.88.245";   // ضع IP جهاز الـGateway

// ========================================
// WS CONNECT
// ========================================

connectWS({

  host: GATEWAY_HOST,

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

      setBoxContent(
        "opcodeResult",
        "❌ missing fields"
      );

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

    setBoxContent(

      "opcodeResult",

      `🚀 Executing:\n\n${opcode}`
    );
  };

// ========================================
// STRESS
// ========================================

function runStress(
  profile
) {

  setBoxContent(

    "stressResults",

    `🔥 Running ${profile} stress...`
  );

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

    case "stress.result":

      setBoxContent(

        "stressResults",

        JSON.stringify(
          data,
          null,
          2
        )
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
// DEVICES RENDER
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

  if (
    !devices.length
  ) {

    box.innerHTML =
      `
      <div class="empty-state">
        No devices connected
      </div>
      `;

    return;
  }

  box.innerHTML =
    devices.map(device => `

      <div class="runtime-device">

        <div class="runtime-device-title">
          ${device.deviceId || "unknown"}
        </div>

        <div class="runtime-device-meta">
          ${device.ip || "-"}
        </div>

        <div class="runtime-device-meta">
          ${device.profile || "-"}
        </div>

      </div>

    `).join("");
}

// ========================================
// TERMINAL UI
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

  box.innerHTML +=
    `
    <div class="line">
      ${escapeHtml(text)}
    </div>
    `;

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
      "logsBox"
    );

  if (!box) {
    return;
  }

  box.innerHTML +=
    `
    <div class="line">
      ${escapeHtml(text)}
    </div>
    `;

  box.scrollTop =
    box.scrollHeight;
}

// ========================================
// HELPERS
// ========================================

function setBoxContent(
  id,
  text
) {

  const el =
    document.getElementById(id);

  if (!el) {
    return;
  }

  el.textContent =
    text;
}

function genId() {

  return (
    "req_" +
    Math.random()
      .toString(36)
      .slice(2)
  );
}

function escapeHtml(
  text
) {

  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
