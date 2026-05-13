// frontend/app.js

import {
  executeTerminalCommand
} from "./runtime/terminal.js";

import {
  connectWS
} from "./ws_client.js";

import {
  routeMessage
} from "./runtime/message_router.js";

connectWS({
  onMessage:
    routeMessage
});

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
