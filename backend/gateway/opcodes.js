// backend/gateway/opcodes.js

module.exports = {
  "system.getIdentity": {
    transport: "ssh",
    payload: {
      command: "uname -a"
    },
    parser: "text"
  },

  "system.reboot": {
    transport: "ssh",
    payload: {
      command: "reboot"
    },
    parser: "text"
  }
};
