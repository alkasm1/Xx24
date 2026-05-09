// packages/alm-profiles/mikrotik/system.js

module.exports = {
  reboot(meta = {}) {
    return {
      type: "command",
      transport: "ssh",

      payload: {
        command: "/system reboot"
      },

      timeout: 5000,
      parser: "text"
    };
  },

  getIdentity() {
    return {
      type: "command",
      transport: "ssh",

      payload: {
        command: "/system identity print"
      },

      timeout: 4000,
      parser: "text"
    };
  }
};
