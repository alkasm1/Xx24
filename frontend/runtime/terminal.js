// frontend/runtime/terminal.js

import {
  sendWS
} from "../ws_client.js";

function genRequestId(
  prefix = "term"
) {

  return (
    prefix +
    "_" +
    Math.random()
      .toString(36)
      .slice(2)
  );
}

export function executeTerminalCommand({

  deviceId,
  command

}) {

  return sendWS({

    type:
      "ui.terminal.exec",

    requestId:
      genRequestId(),

    deviceId,

    command
  });
}
