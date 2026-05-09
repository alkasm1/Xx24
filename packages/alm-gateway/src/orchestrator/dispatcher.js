// packages/alm-gateway/src/orchestrator/dispatcher.js

const profiles = require("../../../alm-profiles");

const execute = require(
  "../../../alm-core/src/execution/execution_engine"
);

async function dispatch(
  device,
  opcode,
  meta = {}
) {
  if (!device) {
    throw new Error("Device is required");
  }

  if (!device.profile) {
    throw new Error(
      "Device missing profile"
    );
  }

  if (
    !opcode ||
    typeof opcode !== "string"
  ) {
    throw new Error("Invalid opcode");
  }

  if (!opcode.includes(".")) {
    throw new Error(
      `Invalid opcode format: ${opcode}`
    );
  }

  const profile = profiles[device.profile];

  if (!profile) {
    throw new Error(
      `Unknown profile: ${device.profile}`
    );
  }

  const [group, action] =
    opcode.split(".");

  const moduleGroup = profile[group];

  if (!moduleGroup) {
    throw new Error(
      `Unknown group: ${group}`
    );
  }

  const handler = moduleGroup[action];

  if (typeof handler !== "function") {
    throw new Error(
      `Unknown action: ${action}`
    );
  }

  const descriptor = handler(meta);

  if (
    !descriptor ||
    !descriptor.transport ||
    !descriptor.payload ||
    !descriptor.payload.command
  ) {
    throw new Error(
      `Invalid descriptor for opcode: ${opcode}`
    );
  }

  return execute(device, descriptor);
}

module.exports = dispatch;
