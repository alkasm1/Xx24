import {
  sendOpcode
} from "./send_opcode.js";

export function handleDeviceAction({
  deviceId,
  opcode
}) {

  sendOpcode({
    deviceId,
    opcode
  });
}
