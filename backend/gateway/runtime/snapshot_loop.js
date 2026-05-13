// backend/gateway/runtime/snapshot_loop.js

function sanitizeDevice(
  device
) {

  return {
    deviceId:
      device.deviceId,

    ip:
      device.ip,

    port:
      device.port,

    method:
      device.method,

    profile:
      device.profile,

    vendor:
      device.vendor,

    status:
      device.status,

    lastSeen:
      device.lastSeen,

    capabilities:
      Array.isArray(
        device.capabilities
      )
        ? device.capabilities
        : []
  };
}

function startSnapshotLoop({

  registry,
  metrics,
  sessionManager,
  taskManager,
  sendToUI,
  getBroadcasts,

  intervalMs = 2000
}) {

  return setInterval(() => {

    const rawDevices =
      registry.getAll();

    const devices =
      rawDevices.map(
        sanitizeDevice
      );

    sendToUI({
      type:
        "snapshot",

      devices,

      metrics:
        metrics.snapshot(),

      broadcasts:
        getBroadcasts(),

      sessions:
        sessionManager.listSessions(),

      activeTasks:
        taskManager.listTasks()
    });

  }, intervalMs);
}

module.exports = {
  startSnapshotLoop
};
