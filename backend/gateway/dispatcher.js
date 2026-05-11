const transportRegistry = require(
  "./transports"
);

const Queue = require(
  "../../packages/alm-core/src/runtime/queue"
);

const {
  resolveOpcode
} = require(
  "../../packages/alm-profiles"
);

// -----------------------------
// EXECUTION QUEUES
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
// BUILD DESCRIPTOR
// -----------------------------
function buildDescriptor(
  device,
  opcodeName,
  meta = {}
) {
  if (!device.profile) {
    throw new Error(
      `Device missing profile: ${device.deviceId}`
    );
  }

  const resolver =
    resolveOpcode(
      device.profile,
      opcodeName
    );

  if (
    typeof resolver !==
    "function"
  ) {
    throw new Error(
      `Opcode resolver invalid: ${opcodeName}`
    );
  }

  const descriptor =
    resolver(meta);

  if (!descriptor) {
    throw new Error(
      `Descriptor build failed: ${opcodeName}`
    );
  }

  if (
    !descriptor.transport
  ) {
    throw new Error(
      `Descriptor missing transport: ${opcodeName}`
    );
  }

  return descriptor;
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

  if (!opcodeName) {
    throw new Error(
      "Opcode is required"
    );
  }

  // -----------------------------
  // BUILD OPCODE DESCRIPTOR
  // -----------------------------
  const descriptor =
    buildDescriptor(
      device,
      opcodeName,
      meta
    );

  // -----------------------------
  // TRANSPORT
  // -----------------------------
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

            resolve({
              opcode:
                opcodeName,

              profile:
                device.profile,

              descriptor,

              ...result
            });
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

// -----------------------------
// STATS
// -----------------------------
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

  buildDescriptor,

  getDispatcherStats
};
