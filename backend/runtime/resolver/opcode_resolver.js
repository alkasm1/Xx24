// backend/runtime/resolver/opcode_resolver.js

// =====================================
// LINUX OPCODES
// =====================================

const linuxOpcodes = {

  // ===================================
  // GENERIC EXEC
  // ===================================

  "system.exec": (
    meta = {}
  ) => ({

    type: "command",

    transport: "ssh",

    payload: {

      command:
        meta.command ||
        "uname -a"
    },

    timeout: 15000,

    parser: "text"
  }),

  // ===================================
  // IDENTITY
  // ===================================

  "system.getIdentity": () => ({

    type: "command",

    transport: "ssh",

    payload: {

      command:
        "uname -a"
    },

    timeout: 10000,

    parser: "text"
  }),

  // ===================================
  // HOSTNAME
  // ===================================

  "system.hostname": () => ({

    type: "command",

    transport: "ssh",

    payload: {

      command:
        "hostname"
    },

    timeout: 10000,

    parser: "text"
  }),

  // ===================================
  // UPTIME
  // ===================================

  "system.uptime": () => ({

    type: "command",

    transport: "ssh",

    payload: {

      command:
        "uptime"
    },

    timeout: 10000,

    parser: "text"
  })
};

// =====================================
// PROFILE REGISTRY
// =====================================

const registry = {

  linux:
    linuxOpcodes
};

// =====================================
// RESOLVE
// =====================================

function resolveOpcodeHandler({

  profile,

  opcode
}) {

  if (!profile) {

    throw new Error(
      "Profile is required"
    );
  }

  if (!opcode) {

    throw new Error(
      "Opcode is required"
    );
  }

  const profileRegistry =

    registry[
      String(profile)
        .toLowerCase()
    ];

  if (!profileRegistry) {

    throw new Error(
      `Unsupported profile: ${profile}`
    );
  }

  const handler =

    profileRegistry[
      opcode
    ];

  if (!handler) {

    throw new Error(
      `Opcode not found: ${opcode}`
    );
  }

  return handler;
}

// =====================================
// EXPORT
// =====================================

module.exports = {

  resolveOpcodeHandler
};
