const {
  getOpcode
} = require(
  "../devices/profile_registry"
);

// =====================================
// RESOLVE OPCODE
// =====================================

function resolveOpcode({

  device,

  opcode
}) {

  if (!device) {

    throw new Error(
      "Device required"
    );
  }

  if (!opcode) {

    throw new Error(
      "Opcode required"
    );
  }

  // =====================================
  // PROFILE
  // =====================================

  const profileId =
    device.profile ||
    "linux";

  // =====================================
  // OPCODE DESCRIPTOR
  // =====================================

  const descriptor =
    getOpcode({

      profileId,

      opcode
    });

  if (!descriptor) {

    throw new Error(

      `Opcode not found: ${opcode}`
    );
  }

  // =====================================

  return {

    profileId,

    opcode,

    descriptor
  };
}

module.exports = {

  resolveOpcode
};
