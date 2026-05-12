import {
  sendWS
} from "../../ws_client.js";

export function sendOpcode({
  deviceId,
  opcode,
  meta = {}
}) {

  const requestId =
    "req_" +
    Math.random()
      .toString(36)
      .slice(2);

  return sendWS({
    type: "ui.opcode",

    requestId,

    deviceId,

    opcode,

    meta
  });
}
