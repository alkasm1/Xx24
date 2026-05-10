// packages/alm-core/runtime/task_events.js

const TASK_EVENTS = Object.freeze({
  CREATED: "task.created",
  STARTED: "task.started",
  COMPLETED: "task.completed",
  FAILED: "task.failed",
  TIMEOUT: "task.timeout",
  UPDATE: "task.update"
});

module.exports = {
  TASK_EVENTS
};
