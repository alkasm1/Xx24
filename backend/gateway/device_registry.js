// backend/gateway/device_registry.js

const DEVICE_TIMEOUT_MS =
  30000;

class DeviceRegistry {
  constructor() {
    this.devices =
      new Map();

    this.upsert("router-1", {
      deviceId: "router-1",

      ip: "192.168.88.224",

      port: 8022,

      username: "admin",

      password: "1234",

      method: "ssh",

      profile: "linux",

      vendor: "generic",

      status: "online",

      lastSeen:
        Date.now(),

      capabilities: [
        "system.getIdentity",
        "system.reboot"
      ]
    });

    // cleanup loop
    setInterval(() => {
      this.cleanupExpired();
    }, 5000);
  }

  upsert(id, data) {
    this.devices.set(id, {
      ...data,
      deviceId: id
    });
  }

  get(id) {
    return this.devices.get(id);
  }

  getAll() {
    return Array.from(
      this.devices.values()
    );
  }

  update(id, data) {
    if (
      !this.devices.has(id)
    ) {
      return;
    }

    this.devices.set(id, {
      ...this.devices.get(id),
      ...data
    });
  }

  remove(id) {
    return this.devices.delete(
      id
    );
  }

  cleanupExpired() {
    const now = Date.now();

    for (const device of this.devices.values()) {
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

  getStats() {
    let online = 0;
    let offline = 0;

    for (const d of this.devices.values()) {
      if (
        d.status === "online"
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
