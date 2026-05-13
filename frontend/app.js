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

// -----------------------------
// WS CONNECT
// -----------------------------
connectWS({
  onMessage:
    routeMessage
});

// -----------------------------
// OPCODE EXECUTION
// -----------------------------
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

    const requestId =
      "req_" +
      Math.random()
        .toString(36)
        .slice(2);

    sendWS({

      type:
        "ui.opcode",

      requestId,

      deviceId,

      opcode,

      meta: {}
    });
  };

// -----------------------------
// TERMINAL EXECUTION
// -----------------------------
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

    executeTerminalCommand({
      deviceId,
      command
    });
  };

// -----------------------------
// STRESS EXECUTION
// -----------------------------
function runStress(
  profile
) {

  sendWS({

    type:
      "ui.stress.run",

    profile
  });
}

// -----------------------------
// STRESS BUTTONS
// -----------------------------
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
