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

async function executeOpcode({
  device,
  opcode,
  meta = {}
}) {

  const descriptor =
    buildDescriptor({
      device,
      opcode,
      meta
    });

  const adapter =
    resolveTransport(
      descriptor.transport
    );

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
              opcode,
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
            `${device.deviceId}-${opcode}`
        }
      );
    }
  );
}

module.exports = {
  executeOpcode
};
