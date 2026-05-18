const {
  resolveOpcode
} = require(
  "../../gateway/opcodes/registry"
);

// =====================================
// RESOLVE OPCODE HANDLER
// =====================================

function resolveOpcodeHandler({

  profile,

  opcode
}) {

  const mod =
    resolveOpcode(
      opcode
    );

  if (!mod) {

    throw new Error(

      `Opcode not found: ${opcode}`
    );
  }

  // ===================================
  // PROFILE VALIDATION
  // ===================================

  if (

    Array.isArray(
      mod.profiles
    ) &&

    mod.profiles.length > 0

  ) {

    const ok =
      mod.profiles.includes(
        String(profile)
          .toLowerCase()
      );

    if (!ok) {

      throw new Error(

        `Opcode ${opcode} unsupported for profile ${profile}`
      );
    }
  }

  return mod;
}

module.exports = {

  resolveOpcodeHandler
};
