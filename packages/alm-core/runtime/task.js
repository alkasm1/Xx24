// packages/alm-core/runtime/task.js

const {
  TASK_STATES
} = require("./task_states");

class Task {
  constructor({
    id,
    deviceId,
    opcode,
    meta = {}
  }) {
    this.id = id;

    this.deviceId = deviceId;

    this.opcode = opcode;

    this.meta = meta;

    this.status = TASK_STATES.PENDING;

    this.createdAt = Date.now();

    this.startedAt = null;

    this.finishedAt = null;

    this.result = null;

    this.retries = 0;
  }
}

module.exports = Task;
