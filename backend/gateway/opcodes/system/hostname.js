// backend/gateway/opcodes/system/hostname.js

module.exports = {

  opcode:
    "system.hostname",

  name:
    "Hostname",

  description:
    "Get device hostname",

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
          "hostname"
      },

      parser:
        "text",

      timeout:
        10000,

      options: {}
    };
  }
};
