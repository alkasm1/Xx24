// backend/gateway/runtime/task_runtime.js

const crypto =
  require("crypto");

class TaskRuntime {

  constructor({

    dispatcher,

    eventBus
  }) {

    this.dispatcher =
      dispatcher;

    this.eventBus =
      eventBus;

    this.tasks =
      new Map();
  }

  // =====================================
  // CREATE TASK
  // =====================================

  createTask({

    device,

    opcode,

    meta = {}
  }) {

    const id =
      meta.requestId ||

      crypto.randomUUID();

    const task = {

      id,

      deviceId:
        device.deviceId,

      opcode,

      status:
        "PENDING",

      createdAt:
        Date.now(),

      startedAt:
        null,

      finishedAt:
        null,

      result:
        null,

      error:
        null,

      meta
    };

    this.tasks.set(
      id,
      task
    );

    this.eventBus.emit(
      "task.created",
      task
    );

    return task;
  }

  // =====================================
  // EXECUTE
  // =====================================

  async execute({

    device,

    opcode,

    meta = {}
  }) {

    const task =
      this.createTask({

        device,

        opcode,

        meta
      });

    try {

      task.status =
        "RUNNING";

      task.startedAt =
        Date.now();

      this.eventBus.emit(
        "task.started",
        task
      );

      const result =
        await this.dispatcher(
          device,
          opcode,
          meta
        );

      task.status =
        result.success
          ? "SUCCESS"
          : "FAILED";

      task.result =
        result;

      task.finishedAt =
        Date.now();

      this.eventBus.emit(
        "task.completed",
        task
      );

      return task;

    } catch (err) {

      task.status =
        "FAILED";

      task.error =
        err.message ||
        String(err);

      task.finishedAt =
        Date.now();

      this.eventBus.emit(
        "task.failed",
        task
      );

      return task;
    }
  }

  // =====================================
  // GET
  // =====================================

  getTask(id) {

    return this.tasks.get(
      id
    );
  }

  // =====================================
  // LIST
  // =====================================

  listTasks() {

    return Array.from(
      this.tasks.values()
    );
  }
}

module.exports = {
  TaskRuntime
};
