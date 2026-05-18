// backend/gateway/opcodes/system/exec.js

module.exports = {

  opcode:
    "system.exec",

  name:
    "System Command Execution",

  description:
    "Execute shell command over SSH",

  profiles: [
    "linux"
  ],

  transport:
    "ssh",

  timeout:
    15000,

  capabilities: [
    "terminal"
  ],

  build(
    device,
    meta = {}
  ) {

    return {

      type:
        "command",

      transport:
        "ssh",

      payload: {

        command:

          meta.command ||

          "uname -a"
      },

      parser:
        "text",

      timeout:
        15000,

      options: {}
    };
  }
};
