// backend/gateway/opcodes/system/uptime.js

module.exports = {

  opcode:
    "system.uptime",

  name:
    "System Uptime",

  description:
    "Get system uptime",

  profiles: [
    "linux"
  ],

  transport:
    "ssh",

  timeout:
    10000,

  build() {

    return {

      type:
        "command",

      transport:
        "ssh",

      payload: {

        command:
          "uptime"
      },

      parser:
        "text",

      timeout:
        10000,

      options: {}
    };
  }
};
