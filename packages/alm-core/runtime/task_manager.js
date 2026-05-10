// packages/alm-core/runtime/task_manager.js

const Task = require("./task");

const taskStore = require("./task_store");

const {
  TASK_STATES
} = require("./task_states");

const {
  TASK_EVENTS
} = require("./task_events");

const {
  normalizeExecutionResult
} = require("../execution/execution_contract");

const {
  genTaskId
} = require("../ids/gentaskid");

function createTaskManager({
  dispatcher,
  eventBus
}) {
  if (typeof dispatcher !== "function") {
    throw new Error(
      "dispatcher is required for taskManager"
    );
  }

  if (!eventBus) {
    throw new Error(
      "eventBus is required for taskManager"
    );
  }

  function emitTaskUpdate(task) {
    eventBus.emit(
      TASK_EVENTS.UPDATE,
      task
    );
  }

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

    const task = new Task({
      id,
      deviceId: device.deviceId,
      opcode,
      meta: {
        ...meta,
        sessionId:
          sessionId || null
      }
    });

    taskStore.add(task);

    eventBus.emit(
      TASK_EVENTS.CREATED,
      task
    );

    emitTaskUpdate(task);

    taskStore.update(task.id, {
      status: TASK_STATES.RUNNING,
      startedAt: Date.now()
    });

    const runningTask =
      taskStore.get(task.id);

    eventBus.emit(
      TASK_EVENTS.STARTED,
      runningTask
    );

    emitTaskUpdate(runningTask);

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
        status: finalStatus,
        finishedAt: Date.now(),
        result: normalized
      });

      const finalTask =
        taskStore.get(task.id);

      eventBus.emit(
        TASK_EVENTS.COMPLETED,
        finalTask
      );

      emitTaskUpdate(finalTask);

      return finalTask;
    } catch (err) {
      const normalized =
        normalizeExecutionResult({
          success: false,
          error:
            err && err.message
              ? err.message
              : "Execution error"
        });

      taskStore.update(task.id, {
        status: TASK_STATES.FAILED,
        finishedAt: Date.now(),
        result: normalized
      });

      const failedTask =
        taskStore.get(task.id);

      eventBus.emit(
        TASK_EVENTS.FAILED,
        failedTask
      );

      emitTaskUpdate(failedTask);

      return failedTask;
    }
  }

  return {
    executeOpcode,
    getTask: taskStore.get,
    listTasks: taskStore.all
  };
}

module.exports = {
  createTaskManager
};
