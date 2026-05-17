class DeviceState {

  constructor() {

    this.snapshots =
      new Map();
  }

  // =====================================
  // UPDATE
  // =====================================

  update(deviceId, data = {}) {

    const current =
      this.snapshots.get(
        deviceId
      ) || {};

    const snapshot = {

      ...current,

      ...data,

      deviceId,

      updatedAt:
        Date.now()
    };

    this.snapshots.set(
      deviceId,
      snapshot
    );

    return snapshot;
  }

  // =====================================
  // GET
  // =====================================

  get(deviceId) {

    return this.snapshots.get(
      deviceId
    );
  }

  // =====================================
  // GET ALL
  // =====================================

  getAll() {

    return Array.from(
      this.snapshots.values()
    );
  }

  // =====================================
  // REMOVE
  // =====================================

  remove(deviceId) {

    this.snapshots.delete(
      deviceId
    );
  }

  // =====================================
  // CLEAR
  // =====================================

  clear() {

    this.snapshots.clear();
  }
}

module.exports =
  new DeviceState();
