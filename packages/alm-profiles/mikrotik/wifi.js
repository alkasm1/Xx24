// packages/alm-profiles/mikrotik/wifi.js

module.exports = {
  setChannel(meta = {}) {
    const ch = meta.channel || 1;

    return {
      type: "command",
      transport: "ssh",

      payload: {
        command: `/interface wireless set wlan1 channel=${ch}`
      },

      timeout: 5000,
      parser: "text"
    };
  },

  getStations() {
    return {
      type: "command",
      transport: "ssh",

      payload: {
        command:
          "/interface wireless registration-table print"
      },

      timeout: 5000,
      parser: "text"
    };
  }
};
