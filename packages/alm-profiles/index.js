// packages/alm-profiles/index.js

const mikrotikSystem = require("./mikrotik/system");
const mikrotikWifi = require("./mikrotik/wifi");

const linuxSystem = require("./linux/system");

module.exports = {
  routeros: {
    system: mikrotikSystem,
    wifi: mikrotikWifi
  },

  linux: {
    system: linuxSystem
  }
};
