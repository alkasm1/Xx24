import {
  sendWS
}
from "../core/ws.js";

export function executeTerminal({

  deviceId,
  command

}) {

  sendWS({

    type:
      "terminal.exec",

    deviceId,

    command
  });
}
