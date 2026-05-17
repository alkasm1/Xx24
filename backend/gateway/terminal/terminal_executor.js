// backend/gateway/terminal/terminal_executor.js

const {
  dispatch
} = require(
  "../dispatcher"
);

const registry =
  require(
    "../device_registry"
  );

async function executeTerminalCommand({

  deviceId,

  command,

  requestId

}) {

  // =========================
  // VALIDATION
  // =========================

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

  // =========================
  // DEVICE
  // =========================

  const device =
    registry.get(
      deviceId
    );

  if (!device) {

    throw new Error(

      `Device not found: ${deviceId}`
    );
  }

  // =========================
  // DISPATCH
  // =========================

  const result =
    await dispatch(

      device,

      "system.exec",

      {

        command,

        requestId,

        source:
          "terminal",

        runtime:
          true
      }
    );

  // =========================
  // RESPONSE
  // =========================

  return {

    ok:
      !!result.success,

    deviceId,

    command,

    requestId,

    result
  };
}

module.exports = {

  executeTerminalCommand
};
