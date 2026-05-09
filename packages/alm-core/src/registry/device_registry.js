// packages/alm-core/src/registry/device_registry.js

const Device = require("../models/device");

class DeviceRegistry {
  constructor() {
    this.devices = new Map();
  }

  upsert(deviceId, data) {
    const existing = this.devices.get(deviceId);

    if (existing) {
      Object.assign(existing, data);

      if (data.lastSeen) {
        existing.lastSeen = data.lastSeen;
      }

      if (data.status) {
        existing.status = data.status;
      }

      return existing;
    }

    const dev = new Device({
      deviceId,
      ...data
    });

    this.devices.set(deviceId, dev);

    return dev;
  }

  markSeen(deviceId, status = "online") {
    const dev = this.devices.get(deviceId);

    if (!dev) {
      return null;
    }

    dev.touch(status);

    return dev;
  }

  remove(deviceId) {
    return this.devices.delete(deviceId);
  }

  get(deviceId) {
    return this.devices.get(deviceId) || null;
  }

  getAll() {
    return Array.from(this.devices.values());
  }

  getByProfile(profile) {
    return this.getAll().filter(d => d.profile === profile);
  }

  getByVendor(vendor) {
    return this.getAll().filter(d => d.vendor === vendor);
  }

  getStats() {
    const all = this.getAll();

    const online = all.filter(
      d => d.status === "online"
    ).length;

    return {
      total: all.length,
      online,
      offline: all.length - online
    };
  }
}

module.exports = new DeviceRegistry();
