import {
  sendWS
}
from "../core/ws.js";

export function executeOpcode({

  deviceId,
  opcode

}) {

  sendWS({

    type:
      "opcode.exec",

    deviceId,

    opcode
  });
}
