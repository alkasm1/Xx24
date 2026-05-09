// packages/alm-core/src/registry/device_registry.js

const Device = require("../models/device");

class DeviceRegistry {
  constructor() {
    this.devices = new Map();

this.upsert("android-1", {
  deviceId: "android-1",
  ip: "192.168.88.232",
  port: 8022,
  type: "android",
  method: "ssh",
  username: "u0_a0",
  password: "",
  status: "online",
  lastSeen: Date.now()
});
    
    //
    // 🔥 إضافة جهاز Android الحقيقي
    //
    this.upsert("android-1", {
      deviceId: "android-1",
      ip: "192.168.88.232",   // ← IP جهاز الأندرويد
      port: 8022,             // SSH في Termux
      type: "android",
      method: "ssh",
      username: "u0_a0",      // مستخدم Termux
      password: "",           // إذا تستخدم مفتاح SSH اتركه فارغًا
      status: "online",
      lastSeen: Date.now()
    });

    //
    // 🔥 مثال جهاز آخر (اختياري)
    //
    this.upsert("router-1", {
      deviceId: "router-1",
      ip: "192.168.88.50",
      port: 22,
      type: "linux",
      method: "ssh",
      username: "root",
      password: "1234",
      status: "online",
      lastSeen: Date.now()
    });
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
