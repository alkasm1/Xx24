// backend/execution/resolve_opcode.js

// =====================================
// OPCODE TABLE
// =====================================

const OPCODES = {

  // ===================================
  // SYSTEM EXEC
  // ===================================

  "system.exec": (
    meta = {}
  ) => ({

    transport: "ssh",

    payload: {

      command:
        meta.command ||
        "uname -a"
    },

    timeout: 15000
  }),

  // ===================================
  // GET IDENTITY
  // ===================================

  "system.getIdentity": () => ({

    transport: "ssh",

    payload: {

      command:
        "uname -a"
    },

    timeout: 10000
  }),

  // ===================================
  // HOSTNAME
  // ===================================

  "system.hostname": () => ({

    transport: "ssh",

    payload: {

      command:
        "hostname"
    },

    timeout: 10000
  }),

  // ===================================
  // UPTIME
  // ===================================

  "system.uptime": () => ({

    transport: "ssh",

    payload: {

      command:
        "uptime"
    },

    timeout: 10000
  })
};

// =====================================
// RESOLVE
// =====================================

function resolveOpcode(
  opcode,
  meta = {}
) {

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

module.exports = {

  resolveOpcode
};
