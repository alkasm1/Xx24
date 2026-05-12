const {
  resolveOpcodeHandler
} = require(
  "./opcode_resolver"
);

function buildDescriptor({
  device,
  opcode,
  meta = {}
}) {

  if (!device) {
    throw new Error(
      "Device is required"
    );
  }

  const handler =
    resolveOpcodeHandler({
      profile:
        device.profile,

      opcode
    });

  const descriptor =
    handler(meta);

  if (!descriptor) {
    throw new Error(
      `Descriptor build failed: ${opcode}`
    );
  }

  if (
    !descriptor.transport
  ) {
    throw new Error(
      `Descriptor missing transport: ${opcode}`
    );
  }

  return descriptor;
}

module.exports = {
  buildDescriptor
};
