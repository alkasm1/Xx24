// backend/gateway/runtime/execution/execute_opcode.js

const { buildDescriptor } = require("../resolver/descriptor_builder");
const { resolveTransport } = require("../resolver/transport_resolver");
const { getDeviceQueue } = require("../resolver/execution_queue");

async function executeOpcode({ device, opcode, meta = {}, descriptor }) {

  // إذا registry أعطانا descriptor جاهز → نستخدمه
  const finalDescriptor =
    descriptor ||
    buildDescriptor({ device, opcode, meta });

  const adapter = resolveTransport(finalDescriptor.transport);

  const queue = getDeviceQueue(device.deviceId);

  return new Promise((resolve, reject) => {
    queue.push(
      async () => {
        try {
          const result = await adapter.execute(device, finalDescriptor, meta);

          resolve({
            opcode,
            profile: device.profile,
            descriptor: finalDescriptor,
            ...result
          });

        } catch (err) {
          reject(err);
        }
      },
      {
        id: meta.requestId || `${device.deviceId}-${opcode}`
      }
    );
  });
}

module.exports = {
  executeOpcode
};
