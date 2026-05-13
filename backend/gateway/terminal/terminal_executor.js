const {
  dispatch
} = require("../dispatcher");

const registry =
  require("../device_registry");

async function executeTerminalCommand({
  deviceId,
  command,
  requestId
}) {

  if (!deviceId) {
    throw new Error(
      "deviceId required"
    );
  }

  if (!command) {
    throw new Error(
      "command required"
    );
  }

  const device =
    registry.get(deviceId);

  if (!device) {
    throw new Error(
      `Device not found: ${deviceId}`
    );
  }

  // -----------------------------
  // TERMINAL OPCODE
  // -----------------------------
  const result =
    await dispatch(
      device,
      "system.exec",
      {
        command,
        requestId,
        terminal: true
      }
    );

  return {
    ok: true,
    deviceId,
    command,
    requestId,
    result
  };
}

module.exports = {
  executeTerminalCommand
};
