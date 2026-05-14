// backend/gateway/modules/ws_server.js

const WebSocket =
  require("ws");

const eventBus =
  require("../backend/gateway/event_bus");

const registry =
  require("../backend/gateway/device_registry");

const Metrics =
  require("../backend/gateway/metrics");

// ======================================
// METRICS
// ======================================

const metrics =
  new Metrics(
    eventBus,
    registry
  );

// ======================================
// WS SERVER
// ======================================

const WS_PORT = 5001;

const wss =
  new WebSocket.Server({

    host: "0.0.0.0",

    port: WS_PORT
  });

console.log(
  `🌐 WS Dashboard running on ws://0.0.0.0:${WS_PORT}`
);

// ======================================
// BROADCAST
// ======================================

function broadcast(data) {

  const msg =
    JSON.stringify(data);

  wss.clients.forEach(client => {

    if (
      client.readyState ===
      WebSocket.OPEN
    ) {

      client.send(msg);
    }
  });
}

// ======================================
// CONNECTION
// ======================================

wss.on(
  "connection",
  ws => {

    console.log(
      "🟢 Dashboard connected"
    );

    // INITIAL SNAPSHOT
    ws.send(
      JSON.stringify({

        type: "snapshot",

        metrics:
          metrics.snapshot(),

        devices:
          registry.getAll()
      })
    );

    // ==========================
    // MESSAGE
    // ==========================

    ws.on(
      "message",
      raw => {

        try {

          const data =
            JSON.parse(raw);

          // ----------------------
          // PING
          // ----------------------

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

          // ----------------------
          // OPCODE
          // ----------------------

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

          // ----------------------
          // TERMINAL
          // ----------------------

          if (
            data.type ===
            "ui.terminal.exec"
          ) {

            eventBus.emit(
              "ui.terminal.exec",
              data
            );

            return;
          }

          // ----------------------
          // STRESS
          // ----------------------

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

        } catch (err) {

          console.error(
            "WS parse error:",
            err.message
          );
        }
      }
    );

    // ==========================
    // CLOSE
    // ==========================

    ws.on(
      "close",
      () => {

        console.log(
          "🔴 Dashboard disconnected"
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

      type: "ack",

      data: ack
    })
);

eventBus.on(
  "command.timeout",
  info =>
    broadcast({

      type: "timeout",

      data: info
    })
);

eventBus.on(
  "command.sent",
  cmd =>
    broadcast({

      type: "command",

      data: cmd
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
