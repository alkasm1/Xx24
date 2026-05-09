// device_registry.js

class DeviceRegistry {
  constructor() {
    this.devices = new Map();

    // مثال جهاز SSH
    this.upsert("router-1", {
      deviceId: "router-1",
      ip: "192.168.88.232",
      port: 22,
      username: "admin",
      password: "1234",
      method: "ssh",
      status: "online",
      lastSeen: Date.now()
    });
  }

  upsert(id, data) {
    this.devices.set(id, { ...data });
  }

  get(id) {
    return this.devices.get(id);
  }

  getAll() {
    return Array.from(this.devices.values());
  }

  update(id, data) {
    if (!this.devices.has(id)) return;
    this.devices.set(id, { ...this.devices.get(id), ...data });
  }

  // 🔥 الدالة المطلوبة من metrics.js
  getStats() {
    let online = 0;
    let offline = 0;

    for (const d of this.devices.values()) {
      if (d.status === "online") online++;
      else offline++;
    }

    return { online, offline };
  }
}

module.exports = new DeviceRegistry();
