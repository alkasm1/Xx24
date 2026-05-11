// packages/alm-profiles/linux/system.js

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
    const useSudo =
      meta.sudo !== false;

    const command =
      useSudo
        ? "sudo reboot"
        : "reboot";

    return buildCommand(
      command,
      5000
    );
  },

  // -----------------------------
  // UNAME
  // -----------------------------
  uname() {
    return buildCommand(
      "uname -a",
      3000
    );
  },

  // -----------------------------
  // HOSTNAME
  // -----------------------------
  hostname() {
    return buildCommand(
      "hostname",
      2000
    );
  },

  // -----------------------------
  // UPTIME
  // -----------------------------
  uptime() {
    return buildCommand(
      "uptime",
      3000
    );
  },

  // -----------------------------
  // MEMORY INFO
  // -----------------------------
  memory() {
    return buildCommand(
      "free -m",
      3000
    );
  },

  // -----------------------------
  // DISK INFO
  // -----------------------------
  disk() {
    return buildCommand(
      "df -h",
      4000
    );
  },

  // -----------------------------
  // CPU INFO
  // -----------------------------
  cpu() {
    return buildCommand(
      "cat /proc/cpuinfo",
      4000
    );
  }
};
