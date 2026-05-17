// backend/gateway/device_registry.js

const DEVICE_TIMEOUT_MS =
  30000;

class DeviceRegistry {

  constructor() {

    this.devices =
      new Map();

    // =====================================
    // DEVICE
    // =====================================

    this.upsert(
      "router-1",
      {

        deviceId:
          "router-1",

        ip:
          "192.168.88.240",

        port:
          8022,

        username:
          "u0_a123",

        password:
          "",

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

        lastSeen:
          Date.now(),

        capabilities: [

          "system.exec",

          "system.getIdentity",

          "system.hostname",

          "system.uptime"
        ]
      }
    );

    // =====================================
    // CLEANUP LOOP
    // =====================================

    setInterval(
      () => {

        this.cleanupExpired();

      },
      5000
    );
  }

  // =====================================
  // UPSERT
  // =====================================

  upsert(id, data) {

    this.devices.set(
      id,
      {

        ...data,

        deviceId: id
      }
    );
  }

  // =====================================
  // GET
  // =====================================

  get(id) {

    return this.devices.get(
      id
    );
  }

  // =====================================
  // GET ALL
  // =====================================

  getAll() {

    return Array.from(
      this.devices.values()
    );
  }

  // =====================================
  // UPDATE
  // =====================================

  update(id, data) {

    if (
      !this.devices.has(id)
    ) {
      return;
    }

    this.devices.set(
      id,
      {

        ...this.devices.get(id),

        ...data
      }
    );
  }

  // =====================================
  // REMOVE
  // =====================================

  remove(id) {

    return this.devices.delete(
      id
    );
  }

  // =====================================
  // CLEANUP
  // =====================================

  cleanupExpired() {

    const now =
      Date.now();

    for (
      const device
      of this.devices.values()
    ) {

      const age =
        now -
        device.lastSeen;

      if (
        age >
        DEVICE_TIMEOUT_MS
      ) {

        device.status =
          "offline";
      }
    }
  }

  // =====================================
  // STATS
  // =====================================

  getStats() {

    let online = 0;

    let offline = 0;

    for (
      const d
      of this.devices.values()
    ) {

      if (
        d.status ===
        "online"
      ) {

        online++;

      } else {

        offline++;
      }
    }

    return {

      online,

      offline
    };
  }
}

module.exports =
  new DeviceRegistry();
