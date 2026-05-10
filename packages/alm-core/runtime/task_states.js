// packages/alm-core/runtime/task_states.js

const TASK_STATES = Object.freeze({
  PENDING: "PENDING",
  QUEUED: "QUEUED",
  RUNNING: "RUNNING",
  SUCCESS: "SUCCESS",
  FAILED: "FAILED",
  TIMEOUT: "TIMEOUT",
  CANCELLED: "CANCELLED"
});

module.exports = {
  TASK_STATES
};
