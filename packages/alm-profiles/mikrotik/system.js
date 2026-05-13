// packages/alm-profiles/mikrotik/system.js

function buildCommand(
  command,
  timeout = 5000
) {
  return {
    type: "command",

    transport: "ssh",

    payload: {
      command
    },

    timeout,

    parser: "text"
  };
}

module.exports = {

  // -----------------------------
  // REBOOT
  // -----------------------------
  reboot(
    meta = {}
  ) {

    const delay =
      Number(
        meta.delay || 0
      );

    let command =
      "/system reboot";

    if (delay > 0) {

      command =
        `:delay ${delay}; ${command}`;
    }

    return buildCommand(
      command,
      5000
    );
  },

  // -----------------------------
  // GET IDENTITY
  // -----------------------------
  getIdentity() {

    return buildCommand(
      "/system identity print",
      4000
    );
  },

  // -----------------------------
  // TERMINAL EXEC
  // -----------------------------
  exec(
    meta = {}
  ) {

    if (!meta.command) {

      throw new Error(
        "command required"
      );
    }

    return buildCommand(
      meta.command,
      meta.timeout || 10000
    );
  },

  // -----------------------------
  // GET RESOURCE INFO
  // -----------------------------
  getResources() {

    return buildCommand(
      "/system resource print",
      4000
    );
  },

  // -----------------------------
  // GET CLOCK
  // -----------------------------
  getClock() {

    return buildCommand(
      "/system clock print",
      3000
    );
  },

  // -----------------------------
  // GET ROUTERBOARD INFO
  // -----------------------------
  getBoardInfo() {

    return buildCommand(
      "/system routerboard print",
      4000
    );
  }
};
