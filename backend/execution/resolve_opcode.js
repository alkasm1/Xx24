// backend/execution/resolve_opcode.js

// =====================================
// OPCODES
// =====================================

const OPCODES = {

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
// RESOLVE
// =====================================

function resolveOpcode({

  opcode,

  meta = {}
}) {

  const handler =
    OPCODES[
      opcode
    ];

  if (!handler) {

    throw new Error(
      `Opcode not found: ${opcode}`
    );
  }

  return handler(
    meta
  );
}

// =====================================
// EXPORT
// =====================================

module.exports = {

  resolveOpcode
};
