const deviceState =
  require(
    "../../runtime/state/device_state"
  );

const taskState =
  require(
    "../../runtime/state/task_state"
  );

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

    updatedAt:
      device.updatedAt,

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

  return setInterval(
    () => {

      const rawDevices =

        registry.getAll();

      // =====================================
      // UPDATE DEVICE STATE
      // =====================================

      for (
        const device
        of rawDevices
      ) {

        deviceState.update(
          device.deviceId,
          device
        );
      }

      // =====================================
      // SNAPSHOT
      // =====================================

      const devices =

        deviceState
          .getAll()
          .map(
            sanitizeDevice
          );

      const tasks =
        taskState.getAll();

      sendToUI({

        type:
          "runtime.snapshot",

        devices,

        tasks,

        metrics:
          metrics.snapshot(),

        broadcasts:
          getBroadcasts(),

        sessions:
          sessionManager.listSessions(),

        activeTasks:
          taskManager.listTasks(),

        ts:
          Date.now()
      });

    },

    intervalMs
  );
}

module.exports = {
  startSnapshotLoop
};
