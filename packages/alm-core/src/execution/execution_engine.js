// packages/alm-core/src/execution/execution_engine.js

const registry = require(
  "./transport_registry"
);

// -----------------------------
// EXECUTION ENGINE
// -----------------------------
async function execute(
  device,
  descriptor,
  meta = {}
) {
  if (!device) {
    throw new Error(
      "Device is required"
    );
  }

  if (
    !descriptor ||
    !descriptor.transport
  ) {
    throw new Error(
      "Invalid execution descriptor"
    );
  }

  const adapter =
    registry.getTransport(
      descriptor.transport
    );

  if (!adapter) {
    throw new Error(
      `Transport not registered: ${descriptor.transport}`
    );
  }

  const fn =
    adapter.execute ||
    adapter.run;

  if (
    typeof fn !==
    "function"
  ) {
    throw new Error(
      `Invalid transport adapter: ${descriptor.transport}`
    );
  }

  const startedAt =
    Date.now();

  try {
    const result =
      await fn(
        device,
        descriptor,
        meta
      );

    return {
      success: true,

      transport:
        descriptor.transport,

      durationMs:
        Date.now() -
        startedAt,

      result
    };
  } catch (err) {
    return {
      success: false,

      transport:
        descriptor.transport,

      durationMs:
        Date.now() -
        startedAt,

      error:
        err &&
        err.message
          ? err.message
          : "Execution failed"
    };
  }
}

module.exports = execute;
