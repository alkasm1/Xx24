// backend/gateway/device_registry.js

const devices =
  require(
    "./devices/device_manager"
  );

// =====================================
// DEFAULT DEVICE
// =====================================

devices.add({

  deviceId:
    "router-1",

  ip:
    "192.168.88.240",

  port:
    8022,

  username:
    "u0_a123",

  password:
    "123456",

  method:
    "ssh",

  transport:
    "ssh",

  profile:
    "linux",

  vendor:
    "android-termux",

  status:
    "online",

  capabilities: [

    "system.exec",

    "system.getIdentity",

    "system.hostname",

    "system.uptime"
  ]
});

// =====================================

setInterval(() => {

  devices.cleanup(
    30000
  );

}, 5000);

module.exports =
  devices;
