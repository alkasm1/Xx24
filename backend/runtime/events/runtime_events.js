const eventBus =
  require(
    "../../gateway/event_bus"
  );

const deviceState =
  require(
    "../state/device_state"
  );

const taskState =
  require(
    "../state/task_state"
  );

// =====================================
// DEVICE EVENTS
// =====================================

function emitDeviceUpdated(
  device
) {

  const snapshot =
    deviceState.update(
      device.deviceId,
      device
    );

  eventBus.emit(
    "runtime.device.updated",
    snapshot
  );
}

// =====================================
// TASK EVENTS
// =====================================

function emitTaskUpdated(
  task
) {

  taskState.upsert(task);

  eventBus.emit(
    "runtime.task.updated",
    task
  );
}

// =====================================

module.exports = {

  emitDeviceUpdated,

  emitTaskUpdated
};
