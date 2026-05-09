// packages/alm-core/src/execution/execution_engine.js

const registry = require("./transport_registry");

async function execute(device, descriptor) {
  if (!device) {
    throw new Error("Device is required");
  }

  if (!descriptor || !descriptor.transport) {
    throw new Error(
      "Invalid execution descriptor"
    );
  }

  const adapter = registry.getTransport(
    descriptor.transport
  );

  if (!adapter) {
    throw new Error(
      `Transport not registered: ${descriptor.transport}`
    );
  }

  if (typeof adapter.run !== "function") {
    throw new Error(
      `Invalid transport adapter: ${descriptor.transport}`
    );
  }

  return adapter.run(device, descriptor);
}

module.exports = execute;
