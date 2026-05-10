// backend/gateway/dispatcher.js

const opcodes = require("./opcodes");

const sshAdapter = require(
  "./transports/ssh_adapter"
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

  let adapter;

  if (transportName === "ssh") {
    adapter = sshAdapter;
  } else {
    throw new Error(
      `Transport not registered: ${transportName}`
    );
  }

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
