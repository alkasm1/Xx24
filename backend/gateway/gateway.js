// backend/gateway/gateway.js

const { TaskRuntime } = require("./runtime/task_runtime");
require("./transports");

const { createAPIServer } = require("../api/server");
const eventBus = require("./event_bus");
const registry = require("./device_registry");
const Metrics = require("./metrics");
const { dispatch } = require("./dispatcher");
const { createWSServer } = require("./ws");
const initTerminalStream = require("./runtime/terminal_stream");
const { runStress } = require("../../stress/runner");
const { createSessionManager } = require("../../packages/alm-core/runtime/session_manager");
const { startSnapshotLoop } = require("./runtime/snapshot_loop");
const { startUDPRuntime } = require("./runtime/udp_runtime");
const { loadState } = require("./runtime/state_store");
const { discoverDeviceCapabilities } = require("./runtime/runtime_introspection");
const runtimeState = require("./runtime/runtime_state");

// =====================================
// TASK RUNTIME
// =====================================

const taskRuntime = new TaskRuntime({
  dispatcher: dispatch,
  eventBus
});

// =====================================
// SESSION MANAGER
// =====================================

const sessionManager = createSessionManager();

// =====================================
// METRICS
// =====================================

const metrics = new Metrics(eventBus, registry);

// =====================================
// ACTIVE REQUESTS
// =====================================

const activeRequests = new Set();

// =====================================
// LEGACY STATE
// =====================================

const { broadcastRequests } = loadState();

// =====================================
// API SERVER
// =====================================

const { server } = createAPIServer({
  port: 8000
});

// =====================================
// WS SERVER
// =====================================

const { sender } = createWSServer({
  server,
  eventBus,
  taskManager: taskRuntime,
  sessionManager,
  runStress,
  activeRequests
});

// =====================================
// UI SENDER
// =====================================

function sendToUI(obj) {
  sender.broadcast(obj);
}

// =====================================
// TERMINAL STREAM
// =====================================

initTerminalStream(sendToUI);

// =====================================
// TASK EVENTS (الإصدار الصحيح)
// =====================================

function emitTaskUpdate(task) {
  sendToUI({
    type: "task.update",
    task
  });

  const doneStates = ["SUCCESS", "FAILED", "TIMEOUT", "CANCELLED"];

  if (
    doneStates.includes(task.status) &&
    task.meta &&
    task.meta.sessionId
  ) {
    sessionManager.detachTask(task.meta.sessionId, task.id);
  }
}

// كل حدث يستقبل task → نضيفه إلى RuntimeState
eventBus.on("task.created", task => {
  runtimeState.setTask(task);
  emitTaskUpdate(task);
});

eventBus.on("task.started", task => {
  runtimeState.setTask(task);
  emitTaskUpdate(task);
});

eventBus.on("task.completed", task => {
  runtimeState.setTask(task);
  emitTaskUpdate(task);
});

eventBus.on("task.failed", task => {
  runtimeState.setTask(task);
  emitTaskUpdate(task);
});

// =====================================
// SNAPSHOT LOOP
// =====================================

startSnapshotLoop({
  registry,
  metrics,
  sessionManager,
  taskManager: taskRuntime,
  sendToUI,
  getBroadcasts: () => broadcastRequests
});

// =====================================
// UDP RUNTIME
// =====================================

startUDPRuntime({
  registry,
  sendToUI
});

// =====================================
// BOOT
// =====================================

(async () => {
  const devices = registry.getAll();

  for (const device of devices) {
    await discoverDeviceCapabilities(device, registry);
  }
})();

// تسجيل الأجهزة في RuntimeState
for (const device of registry.getAll()) {
  runtimeState.setDevice(device);
}

console.log("🚀 Gateway Runtime Online");
