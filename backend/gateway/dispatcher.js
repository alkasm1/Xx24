// backend/gateway/dispatcher.js

const opcodes = require("./opcodes");

const transportRegistry = require(
  "./transports"
);

async function dispatch(
  device,
  opcodeName,
  meta = {}
) {
  const descriptor =
    opcodes[opcodeName];

  if (!descriptor) {
    throw new Error(
      `Unknown opcode: ${opcodeName}`
    );
  }

  if (!descriptor.transport) {
    throw new Error(
      "Descriptor missing transport"
    );
  }

  const transportName =
    descriptor.transport;

  const adapter =
    transportRegistry.get(
      transportName
    );

  const result =
    await adapter.execute(
      device,
      descriptor,
      meta
    );

  return result;
}

module.exports = {
  dispatch
};
