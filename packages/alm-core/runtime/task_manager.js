async function executeOpcode({
  device,
  opcode,
  meta = {},
  requestId,
  sessionId
}) {
  if (!device) {
    throw new Error(
      "device is required"
    );
  }

  if (!opcode) {
    throw new Error(
      "opcode is required"
    );
  }

  const id =
    requestId || genTaskId();

  // -----------------------------
  // REQUEST DE-DUPE
  // -----------------------------
  const existing =
    taskStore.get(id);

  if (existing) {
    return existing;
  }

  // -----------------------------
  // CREATE TASK
  // -----------------------------
  const task = new Task({
    id,

    deviceId:
      device.deviceId,

    opcode,

    meta: {
      ...meta,

      sessionId:
        sessionId || null
    }
  });

  taskStore.add(task);

  // -----------------------------
  // CREATED EVENT
  // -----------------------------
  eventBus.emit(
    TASK_EVENTS.CREATED,
    task
  );

  emitTaskUpdate(task);

  // -----------------------------
  // RUNNING STATE
  // -----------------------------
  taskStore.update(task.id, {
    status:
      TASK_STATES.RUNNING,

    startedAt:
      Date.now()
  });

  const runningTask =
    taskStore.get(task.id);

  eventBus.emit(
    TASK_EVENTS.STARTED,
    runningTask
  );

  emitTaskUpdate(
    runningTask
  );

  // -----------------------------
  // EXECUTION
  // -----------------------------
  try {
    const rawResult =
      await dispatcher(
        device,
        opcode,
        meta
      );

    const normalized =
      normalizeExecutionResult(
        rawResult
      );

    const finalStatus =
      normalized.success
        ? TASK_STATES.SUCCESS
        : TASK_STATES.FAILED;

    taskStore.update(task.id, {
      status:
        finalStatus,

      finishedAt:
        Date.now(),

      result:
        normalized
    });

    const finalTask =
      taskStore.get(task.id);

    eventBus.emit(
      TASK_EVENTS.COMPLETED,
      finalTask
    );

    emitTaskUpdate(
      finalTask
    );

    return finalTask;
  } catch (err) {
    const normalized =
      normalizeExecutionResult({
        success: false,

        error:
          err &&
          err.message
            ? err.message
            : "Execution error"
      });

    taskStore.update(task.id, {
      status:
        TASK_STATES.FAILED,

      finishedAt:
        Date.now(),

      result:
        normalized
    });

    const failedTask =
      taskStore.get(task.id);

    eventBus.emit(
      TASK_EVENTS.FAILED,
      failedTask
    );

    emitTaskUpdate(
      failedTask
    );

    return failedTask;
  }
}
