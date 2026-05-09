// backend/gateway/opcodes.js

module.exports = {
  "system.getIdentity": {
    transport: "ssh",
    command: "uname -a",
    parser: "text"
  },

  "system.reboot": {
    transport: "ssh",
    command: "reboot",
    parser: "text"
  }
};
