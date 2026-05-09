// backend/gateway/dispatcher.js

const opcodes = require("./opcodes");
const { execSSH } = require("./transports/ssh_adapter");
const { parseResult } = require("./parsers");

async function dispatch(device, opcodeName, meta = {}) {
  const descriptor = opcodes[opcodeName];

  if (!descriptor) {
    throw new Error(`Unknown opcode: ${opcodeName}`);
  }

  if (!descriptor.transport) {
    throw new Error("Descriptor missing transport");
  }

  if (!descriptor.payload) {
    throw new Error("Descriptor missing payload");
  }

  let raw;

  if (descriptor.transport === "ssh") {
    raw = await execSSH(device, descriptor.payload, meta);
  } else {
    throw new Error(`Transport not registered: ${descriptor.transport}`);
  }

  const parsed = parseResult(descriptor.parser, raw);

  return {
    transport: descriptor.transport,
    success: raw.success,
    error: raw.error,
    stdout: raw.stdout,
    stderr: raw.stderr,
    execMs: raw.execMs,
    exitCode: raw.exitCode,
    parsed
  };
}

module.exports = { dispatch };
