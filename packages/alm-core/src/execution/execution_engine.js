// packages/alm-core/src/execution/execution_engine.js

const registry = require("./transport_registry");

async function execute(device, descriptor) {
  const adapter = registry.getTransport(descriptor.transport);

  if (!adapter) {
    throw new Error(
      `Transport not registered: ${descriptor.transport}`
    );
  }

  return adapter.run(device, descriptor);
}

module.exports = execute;
