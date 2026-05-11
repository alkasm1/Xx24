// backend/gateway/dispatcher.js

const opcodes = require("./opcodes");

const transportRegistry = require(
  "./transports"
);

const Queue = require(
  "../../packages/alm-core/src/runtime/queue"
);

// -----------------------------
// EXECUTION QUEUES (Phase 7.3)
// -----------------------------
const deviceQueues =
  new Map();

function getDeviceQueue(
  deviceId
) {
  if (
    !deviceQueues.has(
      deviceId
    )
  ) {
    deviceQueues.set(
      deviceId,
      new Queue({
        concurrency: 1
      })
    );
  }

  return deviceQueues.get(
    deviceId
  );
}

// -----------------------------
// DISPATCH
// -----------------------------
async function dispatch(
  device,
  opcodeName,
  meta = {}
) {
  if (!device) {
    throw new Error(
      "Device is required"
    );
  }

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

  if (!adapter) {
    throw new Error(
      `Transport adapter not found: ${transportName}`
    );
  }

  if (
    typeof adapter.execute !==
    "function"
  ) {
    throw new Error(
      `Invalid adapter: ${transportName}`
    );
  }

  // -----------------------------
  // SERIALIZE DEVICE EXECUTION
  // -----------------------------
  const queue =
    getDeviceQueue(
      device.deviceId
    );

  return new Promise(
    (resolve, reject) => {
      queue.push(
        async () => {
          try {
            const result =
              await adapter.execute(
                device,
                descriptor,
                meta
              );

            resolve(result);
          } catch (err) {
            reject(err);
          }
        },
        {
          id:
            meta.requestId ||
            `${device.deviceId}-${opcodeName}`
        }
      );
    }
  );
}

function getDispatcherStats() {
  const stats = {};

  for (const [
    deviceId,
    queue
  ] of deviceQueues.entries()) {
    stats[deviceId] = {
      queued:
        queue.size(),

      processing:
        queue.processing,

      idle:
        queue.isIdle()
    };
  }

  return stats;
}

module.exports = {
  dispatch,
  getDispatcherStats
};
