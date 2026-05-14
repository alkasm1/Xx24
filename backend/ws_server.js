// backend/gateway/modules/ws_server.js

const WebSocket =
  require("ws");

const eventBus =
  require("../event_bus");

const registry =
  require("../device_registry");

const Metrics =
  require("../metrics");

// ======================================
// METRICS
// ======================================

const metrics =
  new Metrics(
    eventBus,
    registry
  );

// ======================================
// WS CONFIG
// ======================================

const WS_HOST =
  "0.0.0.0";

const WS_PORT =
  5001;

// ======================================
// WS SERVER
// ======================================

const wss =
  new WebSocket.Server({

    host: WS_HOST,

    port: WS_PORT
  });

console.log(
  `🌐 WS Dashboard running on ws://${WS_HOST}:${WS_PORT}`
);

// ======================================
// BROADCAST
// ======================================

function broadcast(data) {

  const payload =
    JSON.stringify(data);

  wss.clients.forEach(client => {

    if (
      client.readyState ===
      WebSocket.OPEN
    ) {

      try {

        client.send(payload);

      } catch (err) {

        console.error(
          "WS send error:",
          err.message
        );
      }
    }
  });
}

// ======================================
// SEND SNAPSHOT
// ======================================

function sendSnapshot(ws) {

  try {

    ws.send(
      JSON.stringify({

        type: "snapshot",

        metrics:
          metrics.snapshot(),

        devices:
          registry.getAll()
      })
    );

  } catch (err) {

    console.error(
      "Snapshot send error:",
      err.message
    );
  }
}

// ======================================
// WS CONNECTION
// ======================================

wss.on(
  "connection",
  (ws, req) => {

    const ip =
      req.socket.remoteAddress;

    console.log(
      `🟢 Dashboard connected: ${ip}`
    );

    // INITIAL SNAPSHOT
    sendSnapshot(ws);

    // ==================================
    // MESSAGE
    // ==================================

    ws.on(
      "message",
      raw => {

        try {

          const data =
            JSON.parse(raw);

          // ------------------------------
          // HEARTBEAT
          // ------------------------------

          if (
            data.type ===
            "ping"
          ) {

            ws.send(
              JSON.stringify({

                type: "pong",

                ts:
                  Date.now()
              })
            );

            return;
          }

          // ------------------------------
          // OPCODE
          // ------------------------------

          if (
            data.type ===
            "ui.opcode"
          ) {

            eventBus.emit(
              "ui.command",
              {

                requestId:
                  data.requestId,

                deviceId:
                  data.deviceId,

                opcode:
                  data.opcode,

                meta:
                  data.meta || {}
              }
            );

            return;
          }

          // ------------------------------
          // TERMINAL
          // ------------------------------

          if (
            data.type ===
            "ui.terminal.exec"
          ) {

            eventBus.emit(
              "ui.terminal.exec",
              {

                requestId:
                  data.requestId,

                deviceId:
                  data.deviceId,

                command:
                  data.command
              }
            );

            return;
          }

          // ------------------------------
          // STRESS
          // ------------------------------

          if (
            data.type ===
            "ui.stress.run"
          ) {

            eventBus.emit(
              "ui.stress.run",
              {

                profile:
                  data.profile
              }
            );

            return;
          }

          // ------------------------------
          // UNKNOWN
          // ------------------------------

          console.log(
            "Unknown WS message:",
            data.type
          );

        } catch (err) {

          console.error(
            "WS parse error:",
            err.message
          );
        }
      }
    );

    // ==================================
    // CLOSE
    // ==================================

    ws.on(
      "close",
      () => {

        console.log(
          `🔴 Dashboard disconnected: ${ip}`
        );
      }
    );

    // ==================================
    // ERROR
    // ==================================

    ws.on(
      "error",
      err => {

        console.error(
          "WS client error:",
          err.message
        );
      }
    );
  }
);

// ======================================
// EVENT BUS → UI
// ======================================

eventBus.on(
  "broadcast.job.created",
  job =>
    broadcast({

      type:
        "job.created",

      job
    })
);

eventBus.on(
  "broadcast.job.update",
  job =>
    broadcast({

      type:
        "job.update",

      job
    })
);

eventBus.on(
  "broadcast.job.done",
  job =>
    broadcast({

      type:
        "job.done",

      job
    })
);

eventBus.on(
  "device.ack",
  ack =>
    broadcast({

      type:
        "ack",

      data: ack
    })
);

eventBus.on(
  "command.timeout",
  info =>
    broadcast({

      type:
        "timeout",

      data: info
    })
);

eventBus.on(
  "command.sent",
  cmd =>
    broadcast({

      type:
        "command",

      data: cmd
    })
);

eventBus.on(
  "terminal.output",
  data =>
    broadcast({

      type:
        "terminal.output",

      ...data
    })
);

eventBus.on(
  "stress.result",
  data =>
    broadcast({

      type:
        "stress.result",

      ...data
    })
);

eventBus.on(
  "log",
  message =>
    broadcast({

      type:
        "log",

      message
    })
);

// ======================================
// SNAPSHOT LOOP
// ======================================

setInterval(() => {

  broadcast({

    type: "snapshot",

    metrics:
      metrics.snapshot(),

    devices:
      registry.getAll()
  });

}, 3000);

// ======================================
// EXPORT
// ======================================

module.exports = {

  wss,

  broadcast
};
