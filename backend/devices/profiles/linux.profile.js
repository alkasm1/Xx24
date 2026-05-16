const profile = {

  id: "linux",

  name: "Linux Generic",

  transport: "ssh",

  capabilities: [

    "terminal",

    "exec",

    "filesystem",

    "network"
  ],

  opcodes: {

    // =========================
    // SYSTEM
    // =========================

    "system.getIdentity": {

      type: "command",

      command: "hostname",

      parser: "text",

      timeout: 5000
    },

    "system.getKernel": {

      type: "command",

      command: "uname -a",

      parser: "text",

      timeout: 5000
    },

    "system.getUptime": {

      type: "command",

      command: "uptime",

      parser: "text",

      timeout: 5000
    },

    // =========================
    // NETWORK
    // =========================

    "network.getInterfaces": {

      type: "command",

      command: "ip addr",

      parser: "text",

      timeout: 10000
    },

    "network.getRoutes": {

      type: "command",

      command: "ip route",

      parser: "text",

      timeout: 10000
    }
  }
};

module.exports = profile;
