// backend/gateway/device_registry.js

class DeviceRegistry {
  constructor() {
    this.devices = new Map();

    this.upsert("router-1", {
      deviceId: "router-1",
      ip: "192.168.88.232",
      port: 22,
      username: "admin",
      password: "1234",
      method: "ssh",
      profile: "linux",
      vendor: "generic",
      status: "online",
      lastSeen: Date.now(),
      capabilities: [
        "system.getIdentity",
        "system.reboot"
      ]
    });
  }
  registry.update("android-1", {
  deviceId: "android-1",
  ip: "127.0.0.1",
  port: 6000,
  method: "udp",
  profile: "fake",
  status: "online",
  lastSeen: Date.now()
});
  upsert(id, data) {
    this.devices.set(id, { ...data, deviceId: id });
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
