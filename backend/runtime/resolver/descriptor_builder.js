// backend/runtime/resolver/descriptor_builder.js

const {
  resolveOpcode
} = require(
  "../../execution/resolve_opcode"
);

// =====================================
// BUILD DESCRIPTOR
// =====================================

function buildDescriptor({

  device,

  opcode,

  meta = {}

}) {

  // =====================================
  // VALIDATION
  // =====================================

  if (!device) {

    throw new Error(
      "Device is required"
    );
  }

  if (!opcode) {

    throw new Error(
      "Opcode is required"
    );
  }

  // =====================================
  // RESOLVE OPCODE
  // =====================================

  const base =
    resolveOpcode({

      device,

      opcode,

      meta
    });

  // =====================================
  // BUILD DESCRIPTOR
  // =====================================

  const descriptor = {

    type:
      base.type ||
      "command",

    transport:

      base.transport ||

      device.transport ||

      "ssh",

    payload:

      base.payload || {},

    parser:

      base.parser ||

      "text",

    timeout:

      base.timeout ||

      10000,

    options: {

      ...(base.options || {}),

      ...(meta.options || {})
    }
  };

  // =====================================
  // VALIDATION
  // =====================================

  if (!descriptor.transport) {

    throw new Error(

      `Descriptor missing transport: ${opcode}`
    );
  }

  return descriptor;
}

// =====================================

module.exports = {

  buildDescriptor
};
