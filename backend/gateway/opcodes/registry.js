// backend/gateway/opcodes/registry.js

const {
  getOpcode,

  getAllOpcodes,

  hasOpcode

} = require(
  "./index"
);

// =====================================
// RESOLVE OPCODE
// =====================================

function resolveOpcode(
  opcode
) {

  const mod =
    getOpcode(
      opcode
    );

  if (!mod) {

    throw new Error(

      `Opcode not found: ${opcode}`
    );
  }

  return mod;
}

// =====================================
// BUILD DESCRIPTOR
// =====================================

function buildOpcodeDescriptor({

  device,

  opcode,

  meta = {}

}) {

  const mod =
    resolveOpcode(
      opcode
    );

  if (
    typeof mod.build !==
    "function"
  ) {

    throw new Error(

      `Opcode missing build(): ${opcode}`
    );
  }

  return mod.build(
    device,
    meta
  );
}

// =====================================
// EXPORT
// =====================================

module.exports = {

  resolveOpcode,

  buildOpcodeDescriptor,

  getAllOpcodes,

  hasOpcode
};
