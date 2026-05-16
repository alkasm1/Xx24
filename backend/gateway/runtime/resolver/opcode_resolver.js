const linuxOpcodes = {

  // =====================================
  // SYSTEM
  // =====================================

  "system.exec": (meta = {}) => ({

    type: "command",

    transport: "ssh",

    payload: {

      command:
        meta.command || "uname -a"
    },

    timeout: 10000,

    parser: "text"
  }),

  "system.getIdentity": () => ({

    type: "command",

    transport: "ssh",

    payload: {

      command: "uname -a"
    },

    timeout: 10000,

    parser: "text"
  }),

  "system.hostname": () => ({

    type: "command",

    transport: "ssh",

    payload: {

      command: "hostname"
    },

    timeout: 10000,

    parser: "text"
  }),

  "system.uptime": () => ({

    type: "command",

    transport: "ssh",

    payload: {

      command: "uptime"
    },

    timeout: 10000,

    parser: "text"
  })
};

// =====================================
// RESOLVER
// =====================================

function resolveOpcodeHandler({

  profile,

  opcode
}) {

  if (!opcode) {

    throw new Error(
      "Opcode is required"
    );
  }

  // =====================================
  // LINUX
  // =====================================

  if (
    profile === "linux"
  ) {

    const handler =
      linuxOpcodes[
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
  // UNKNOWN PROFILE
  // =====================================

  throw new Error(
    `Unsupported profile: ${profile}`
  );
}

module.exports = {

  resolveOpcodeHandler
};
