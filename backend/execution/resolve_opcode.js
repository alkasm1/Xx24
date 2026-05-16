// backend/execution/resolve_opcode.js

// =====================================
// OPCODES
// =====================================

const OPCODES = {

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

  "system.getIdentity": () => ({

    transport: "ssh",

    payload: {

      command:
        "uname -a"
    },

    timeout: 10000
  }),

  "system.hostname": () => ({

    transport: "ssh",

    payload: {

      command:
        "hostname"
    },

    timeout: 10000
  }),

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
// RESOLVE OPCODE
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
