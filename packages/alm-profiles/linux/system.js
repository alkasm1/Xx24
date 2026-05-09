// packages/alm-profiles/linux/system.js

module.exports = {
  reboot() {
    return {
      type: "command",
      transport: "ssh",

      payload: {
        command: "sudo reboot"
      },

      timeout: 5000,
      parser: "text"
    };
  },

  uname() {
    return {
      type: "command",
      transport: "ssh",

      payload: {
        command: "uname -a"
      },

      timeout: 3000,
      parser: "text"
    };
  }
};
