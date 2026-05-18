// backend/gateway/opcodes/system/info.js

module.exports = {

  opcode:
    "system.getIdentity",

  name:
    "System Identity",

  description:
    "Get kernel and platform info",

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
          "uname -a"
      },

      parser:
        "text",

      timeout:
        10000,

      options: {}
    };
  }
};
