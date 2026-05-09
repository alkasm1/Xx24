// packages/alm-core/src/models/device.js

class Device {
  constructor({
    deviceId,
    ip,
    type,
    vendor,
    profile,
    method,
    capabilities = [],
    state = {},
    metrics = {},
    metadata = {},
    status = "offline",
    lastSeen = null,
    port = 22,
    username = null,
    password = null
  }) {
    this.deviceId = deviceId;
    this.ip = ip;

    this.type = type;
    this.vendor = vendor;
    this.profile = profile;
    this.method = method;

    this.capabilities = capabilities;

    this.state = state;
    this.metrics = metrics;
    this.metadata = metadata;

    this.status = status;
    this.lastSeen = lastSeen;

    this.port = port;
    this.username = username;
    this.password = password;
  }

  touch(status = null) {
    this.lastSeen = Date.now();

    if (status) {
      this.status = status;
    }
  }

  toJSON() {
    return {
      deviceId: this.deviceId,
      ip: this.ip,

      type: this.type,
      vendor: this.vendor,
      profile: this.profile,
      method: this.method,

      capabilities: this.capabilities,

      state: this.state,
      metrics: this.metrics,
      metadata: this.metadata,

      status: this.status,
      lastSeen: this.lastSeen,

      port: this.port
    };
  }
}

module.exports = Device;
