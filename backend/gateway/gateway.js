// backend/gateway/gateway.js

const {
  createSessionManager
} = require(
  "../../packages/alm-core/runtime/session_manager"
);

const {
  createTaskManager
} = require(
  "../../packages/alm-core/runtime/task_manager"
);

require("./transports");

const originalLog =
  console.log;

// -----------------------------
// CORE IMPORTS
// -----------------------------
const dgram =
  require("dgram");

const fs =
  require("fs");

const crypto =
  require("crypto");

const udp =
  dgram.createSocket("udp4");

// -----------------------------
// INTERNAL MODULES
// -----------------------------
const eventBus =
  require("./event_bus");

const registry =
  require("./device_registry");

const Metrics =
  require("./metrics");

const {
  dispatch
} = require(
  "./dispatcher"
);

const {
  createWSServer
} = require("./ws");

// -----------------------------
// STRESS RUNNER
// -----------------------------
const {
  runStress
} = require(
  "../../stress/runner"
);

// -----------------------------
// RUNTIME MANAGERS
// -----------------------------
const taskManager =
  createTaskManager({
    dispatcher:
      dispatch,

    eventBus
  });

const sessionManager =
  createSessionManager();

// -----------------------------
// METRICS
// -----------------------------
const metrics =
  new Metrics(
    eventBus,
    registry
  );

// -----------------------------
// CONSTANTS
// -----------------------------
const SECRET =
  "alm_shared_secret";

const STATE_FILE =
  "./state.json";

// -----------------------------
// ACTIVE REQUESTS
// -----------------------------
const activeRequests =
  new Set();

// -----------------------------
// WS SERVER
// -----------------------------
const {
  wss,
  sender
} = createWSServer({
  eventBus,

  taskManager,

  sessionManager,

  runStress,

  activeRequests
});

// -----------------------------
// UI SENDER
// -----------------------------
function sendToUI(obj) {
  sender.broadcast(obj);
}

// -----------------------------
// TASK EVENTS → UI
// -----------------------------
function emitTaskUpdate(
  task
) {

  sendToUI({
    type:
      "task.update",

    task
  });

  const doneStates = [
    "SUCCESS",
    "FAILED",
    "TIMEOUT",
    "CANCELLED"
  ];

  if (
    doneStates.includes(
      task.status
    ) &&
    task.meta &&
    task.meta.sessionId
  ) {

    sessionManager.detachTask(
      task.meta.sessionId,
      task.id
    );
  }
}

function bindTaskEventsToUI() {

  eventBus.on(
    "task.created",
    emitTaskUpdate
  );

  eventBus.on(
    "task.started",
    emitTaskUpdate
  );

  eventBus.on(
    "task.completed",
    emitTaskUpdate
  );

  eventBus.on(
    "task.failed",
    emitTaskUpdate
  );
}

bindTaskEventsToUI();

// -----------------------------
// TERMINAL STREAM
// -----------------------------
console.log = (
  ...args
) => {

  originalLog(...args);

  try {

    const payload =
      args
        .map(a =>
          typeof a ===
          "object"
            ? JSON.stringify(a)
            : String(a)
        )
        .join(" ");

    sendToUI({
      type: "terminal",
      line: payload
    });

  } catch (_) {}
};

// -----------------------------
// HELPERS
// -----------------------------
function stableStringify(
  obj
) {

  if (
    obj === null ||
    typeof obj !==
      "object"
  ) {

    return JSON.stringify(
      obj
    );
  }

  if (
    Array.isArray(obj)
  ) {

    return (
      "[" +
      obj
        .map(
          stableStringify
        )
        .join(",") +
      "]"
    );
  }

  return (
    "{" +
    Object.keys(obj)
      .sort()
      .map(
        k =>
          JSON.stringify(k) +
          ":" +
          stableStringify(
            obj[k]
          )
      )
      .join(",") +
    "}"
  );
}

function signPacket(
  packet
) {

  return crypto
    .createHmac(
      "sha256",
      SECRET
    )
    .update(
      stableStringify(
        packet
      )
    )
    .digest("hex");
}

function verifySignature(
  packet
) {

  const sig =
    packet.sig;

  const base = {
    ...packet
  };

  delete base.sig;

  return (
    signPacket(base) ===
    sig
  );
}

function genNonce() {

  return crypto
    .randomBytes(8)
    .toString("hex");
}

function genId() {

  return (
    "req_" +
    Math.random()
      .toString(36)
      .slice(2)
  );
}

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

// -----------------------------
// STATE
// -----------------------------
let pendingRequests =
  {};

let broadcastRequests =
  {};

function serializeRequests(
  obj
) {

  const clean = {};

  for (const id in obj) {

    const r =
      obj[id];

    clean[id] = {
      requestId:
        r.requestId,

      deviceId:
        r.deviceId,

      commandId:
        r.commandId,

      meta:
        r.meta,

      retries:
        r.retries,

      maxRetries:
        r.maxRetries,

      state:
        r.state,

      broadcastId:
        r.broadcastId
    };
  }

  return clean;
}

function saveState() {

  fs.writeFileSync(
    STATE_FILE,
    JSON.stringify(
      {
        pendingRequests:
          serializeRequests(
            pendingRequests
          ),

        broadcastRequests
      },
      null,
      2
    )
  );
}

function loadState() {

  if (
    !fs.existsSync(
      STATE_FILE
    )
  ) {

    return;
  }

  const state =
    JSON.parse(
      fs.readFileSync(
        STATE_FILE
      )
    );

  pendingRequests =
    state.pendingRequests ||
    {};

  broadcastRequests =
    state.broadcastRequests ||
    {};

  console.log(
    "🦎 State restored"
  );
}

// -----------------------------
// UDP LISTENER
// -----------------------------
udp.on(
  "message",
  (
    buf,
    rinfo
  ) => {

    let packet;

    try {

      packet =
        JSON.parse(
          buf.toString()
        );

    } catch {

      return;
    }

    if (
      !verifySignature(
        packet
      )
    ) {

      console.log(
        "❌ Invalid signature → dropped"
      );

      return;
    }

    // -----------------------------
    // HEARTBEAT
    // -----------------------------
    if (
      packet.type ===
      "heartbeat"
    ) {

      const existing =
        registry.get(
          packet.deviceId
        );

      if (existing) {

        registry.update(
          packet.deviceId,
          {
            ip:
              rinfo.address,

            port:
              rinfo.port,

            lastSeen:
              Date.now(),

            status:
              "online"
          }
        );

      } else {

        registry.upsert(
          packet.deviceId,
          {
            deviceId:
              packet.deviceId,

            ip:
              rinfo.address,

            port:
              rinfo.port,

            method:
              "udp",

            profile:
              "unknown",

            vendor:
              "unknown",

            status:
              "online",

            lastSeen:
              Date.now(),

            capabilities:
              []
          }
        );
      }

      return;
    }

    // -----------------------------
    // ACK
    // -----------------------------
    if (
      packet.type ===
      "ack"
    ) {

      handleAck(packet);

      return;
    }
  }
);

udp.bind(5000);

// -----------------------------
// LEGACY UDP COMMANDS
// -----------------------------
function sendPacket(
  device,
  request
) {

  const packet = {
    type: "cmd",

    requestId:
      request.requestId,

    deviceId:
      request.deviceId,

    commandId:
      request.commandId,

    meta:
      request.meta,

    nonce:
      genNonce()
  };

  packet.sig =
    signPacket(packet);

  const buf =
    Buffer.from(
      JSON.stringify(
        packet
      )
    );

  udp.send(
    buf,
    0,
    buf.length,
    device.port,
    device.ip
  );
}

function dispatchCommand(
  deviceId,
  commandId,
  meta = {},
  broadcastId = null
) {

  const device =
    registry.get(
      deviceId
    );

  if (!device) {
    return;
  }

  const request = {
    requestId:
      genId(),

    deviceId,

    commandId,

    meta,

    retries: 0,

    maxRetries: 0,

    state:
      "PENDING",

    broadcastId
  };

  pendingRequests[
    request.requestId
  ] = request;

  sendPacket(
    device,
    request
  );

  scheduleTimeout(
    request.requestId
  );
}

function handleAck(
  packet
) {

  const request =
    pendingRequests[
      packet.requestId
    ];

  if (!request) {
    return;
  }

  clearTimeout(
    request._timeoutRef
  );

  request.state =
    "COMPLETED";

  request.execMs =
    packet.execMs || 0;

  delete pendingRequests[
    packet.requestId
  ];

  console.log(
    "✅ ACK:",
    packet.requestId
  );

  if (
    request.broadcastId
  ) {

    updateBroadcast(
      request.broadcastId,
      request.deviceId,
      "OK"
    );
  }

  sendToUI({
    type:
      "cmd_completed",

    deviceId:
      request.deviceId,

    commandId:
      request.commandId,

    execMs:
      request.execMs
  });

  saveState();
}

function scheduleTimeout(
  id
) {

  const r =
    pendingRequests[id];

  if (!r) {
    return;
  }

  r._timeoutRef =
    setTimeout(
      () =>
        handleTimeout(id),
      2000
    );
}

function handleTimeout(
  id
) {

  const r =
    pendingRequests[id];

  if (!r) {
    return;
  }

  const device =
    registry.get(
      r.deviceId
    );

  if (!device) {
    return;
  }

  if (
    r.retries >=
    r.maxRetries
  ) {

    delete pendingRequests[
      id
    ];

    if (
      r.broadcastId
    ) {

      updateBroadcast(
        r.broadcastId,
        r.deviceId,
        "FAILED"
      );
    }

    sendToUI({
      type:
        "cmd_failed",

      deviceId:
        r.deviceId,

      commandId:
        r.commandId
    });

    saveState();

    return;
  }

  r.retries++;

  sendPacket(
    device,
    r
  );

  scheduleTimeout(
    id
  );
}

// -----------------------------
// BROADCAST
// -----------------------------
function broadcastCommand(
  commandId,
  meta = {}
) {

  const devices =
    registry.getAll();

  const id =
    "bc_" +
    Math.random()
      .toString(36)
      .slice(2);

  console.log(
    "🧩 BROADCAST START:",
    id
  );

  broadcastRequests[
    id
  ] = {
    broadcastId:
      id,

    commandId,

    devices: {},

    status:
      "PENDING"
  };

  devices.forEach(
    d => {

      broadcastRequests[
        id
      ].devices[
        d.deviceId
      ] = "PENDING";

      dispatchCommand(
        d.deviceId,
        commandId,
        meta,
        id
      );
    }
  );

  saveState();
}

function updateBroadcast(
  broadcastId,
  deviceId,
  status
) {

  const bc =
    broadcastRequests[
      broadcastId
    ];

  if (!bc) {
    return;
  }

  bc.devices[
    deviceId
  ] = status;

  const states =
    Object.values(
      bc.devices
    );

  if (
    states.every(
      s => s === "OK"
    )
  ) {

    bc.status =
      "COMPLETED";

  } else if (
    states.every(
      s =>
        s !==
        "PENDING"
    )
  ) {

    bc.status =
      "PARTIAL";
  }

  if (
    bc.status !==
    "PENDING"
  ) {

    console.log(
      "📊 BROADCAST DONE:",
      broadcastId,
      "|",
      bc.status
    );

    sendToUI({
      type:
        "broadcast_done",

      broadcastId,

      status:
        bc.status,

      devices:
        bc.devices
    });
  }

  saveState();
}

// -----------------------------
// SNAPSHOT LOOP
// -----------------------------
setInterval(() => {

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
      broadcastRequests,

    sessions:
      sessionManager.listSessions(),

    activeTasks:
      taskManager.listTasks()
  });

}, 2000);

// -----------------------------
// BOOT
// -----------------------------
loadState();

console.log(
  "🚀 Gateway Phase 8.6 running (WS Modularized)"
);
