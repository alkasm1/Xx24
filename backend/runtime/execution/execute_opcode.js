const {
  emitDeviceUpdated
} = require(
  "../events/runtime_events"
);
const {
  buildDescriptor
} = require(
  "../resolver/descriptor_builder"
);

const {
  resolveTransport
} = require(
  "../resolver/transport_resolver"
);

const {
  getDeviceQueue
} = require(
  "../resolver/execution_queue"
);

// =====================================
// EXECUTE OPCODE
// =====================================

async function executeOpcode({

  device,

  opcode,

  descriptor = null,

  profileId = null,

  meta = {}

}) {

  // =====================================
  // DESCRIPTOR
  // =====================================

  const runtimeDescriptor =

    descriptor ||

    buildDescriptor({

      device,

      opcode,

      meta
    });

  // =====================================
  // TRANSPORT
  // =====================================

  const transportName =

    runtimeDescriptor.transport ||

    device.transport ||

    "ssh";

  const adapter =
    resolveTransport(
      transportName
    );

  if (!adapter) {

    throw new Error(

      `Transport adapter not found: ${transportName}`
    );
  }

  // =====================================
  // DEVICE QUEUE
  // =====================================

  const queue =
    getDeviceQueue(
      device.deviceId
    );

  // =====================================
  // EXECUTION
  // =====================================

  return new Promise(

    (resolve, reject) => {

      queue.push(

        async () => {

          try {

            emitDeviceUpdated({

  ...device,

  status:
    "busy",

  activeOpcode:
    opcode
});
            const result =

              await adapter.execute(

                device,

                runtimeDescriptor,

                meta
              );

            emitDeviceUpdated({

  ...device,

  status:
    "online",

  activeOpcode:
    null,

  lastExecution:
    Date.now()
});
            resolve({

              success:
                result.success,

              opcode,

              profile:
                profileId ||

                device.profile ||

                "unknown",

              transport:
                transportName,

              descriptor:
                runtimeDescriptor,

              ...result
            });

          } catch (err) {

            reject({

              success: false,

              opcode,

              profile:
                profileId ||

                device.profile ||

                "unknown",

              transport:
                transportName,

              error:
                err.message ||

                String(err)
            });
          }

        },

        {
          id:

            meta.requestId ||

            `${device.deviceId}-${opcode}`
        }
      );
    }
  );
}

// =====================================

module.exports = {

  executeOpcode
};
