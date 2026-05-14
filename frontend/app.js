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

// -----------------------------
// HELPERS
// -----------------------------
function genRequestId(
  prefix = "req"
) {

  return (
    prefix +
    "_" +
    Math.random()
      .toString(36)
      .slice(2)
  );
}

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
function sendOpcode() {

  const deviceId =
    document.getElementById(
      "opcodeDevice"
    )?.value;

  const opcode =
    document.getElementById(
      "opcodeInput"
    )?.value;

  if (
    !deviceId ||
    !opcode
  ) {

    console.warn(
      "Missing opcode params"
    );

    return;
  }

  sendWS({

    type:
      "ui.opcode",

    requestId:
      genRequestId(),

    deviceId,

    opcode,

    meta: {}
  });
}

// -----------------------------
// TERMINAL EXECUTION
// -----------------------------
function runTerminal() {

  const deviceId =
    document.getElementById(
      "opcodeDevice"
    )?.value;

  const command =
    document.getElementById(
      "terminalInput"
    )?.value;

  if (
    !deviceId ||
    !command
  ) {

    console.warn(
      "Missing terminal params"
    );

    return;
  }

  executeTerminalCommand({
    deviceId,
    command
  });
}

// -----------------------------
// STRESS EXECUTION
// -----------------------------
function runStress(
  profile
) {

  sendWS({

    type:
      "ui.stress.run",

    requestId:
      genRequestId("stress"),

    profile
  });
}

// -----------------------------
// UI EVENTS
// -----------------------------
function bindUI() {

  // OPCODE BUTTON
  document
    .getElementById(
      "runOpcodeBtn"
    )
    ?.addEventListener(
      "click",
      sendOpcode
    );

  // TERMINAL BUTTON
  document
    .getElementById(
      "runTerminalBtn"
    )
    ?.addEventListener(
      "click",
      runTerminal
    );

  // STRESS BUTTONS
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
}

// -----------------------------
// INIT
// -----------------------------
window.addEventListener(
  "DOMContentLoaded",
  () => {

    bindUI();
  }
);
