// backend/gateway/devices/device_manager.js

class DeviceManager {

  constructor() {

    this.devices =
      new Map();
  }

  // =====================================
  // ADD
  // =====================================

  add(device) {

    if (
      !device.deviceId
    ) {

      throw new Error(
        "deviceId required"
      );
    }

    this.devices.set(
      device.deviceId,
      {

        ...device,

        status:
          device.status ||
          "online",

        lastSeen:
          Date.now()
      }
    );

    return this.devices.get(
      device.deviceId
    );
  }

  // =====================================
  // UPDATE
  // =====================================

  update(
    deviceId,
    patch = {}
  ) {

    const current =
      this.devices.get(
        deviceId
      );

    if (!current) {

      throw new Error(
        `Device not found: ${deviceId}`
      );
    }

    const updated = {

      ...current,

      ...patch,

      lastSeen:
        Date.now()
    };

    this.devices.set(
      deviceId,
      updated
    );

    return updated;
  }

  // =====================================
  // REMOVE
  // =====================================

  remove(deviceId) {

    return this.devices.delete(
      deviceId
    );
  }

  // =====================================
  // GET
  // =====================================

  get(deviceId) {

    return this.devices.get(
      deviceId
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
  // EXISTS
  // =====================================

  has(deviceId) {

    return this.devices.has(
      deviceId
    );
  }

  // =====================================
  // TOUCH
  // =====================================

  touch(deviceId) {

    const device =
      this.devices.get(
        deviceId
      );

    if (!device) {
      return;
    }

    device.lastSeen =
      Date.now();

    device.status =
      "online";
  }

  // =====================================
  // CLEANUP
  // =====================================

  cleanup(
    timeoutMs = 30000
  ) {

    const now =
      Date.now();

    for (
      const device
      of this.devices.values()
    ) {

      if (
        now -
          device.lastSeen >
        timeoutMs
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

      offline,

      total:
        this.devices.size
    };
  }
}

module.exports =
  new DeviceManager();
