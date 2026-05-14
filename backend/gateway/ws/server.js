// backend/gateway/ws/server.js

const WebSocket =
  require("ws");

const {
  createSender
} = require("./sender");

const {
  createHandlers
} = require("./handlers");

const {
  startHeartbeatLoop
} = require("./heartbeat");

function createWSServer({

  server,

  eventBus,

  taskManager,

  sessionManager,

  runStress,

  activeRequests

}) {

  // =====================================
  // WS SERVER ON TOP OF HTTP SERVER
  // =====================================

  const wss =
    new WebSocket.Server({

      server
    });

  console.log(
    "🌐 WebSocket attached to HTTP server"
  );

  // =====================================
  // SENDER
  // =====================================

  const sender =
    createSender(wss);

  // =====================================
  // CONNECTION
  // =====================================

  wss.on(
    "connection",
    ws => {

      const session =
        sessionManager.createSession(
          ws,
          {

            remoteAddress:

              ws._socket
                ?.remoteAddress ||

              null
          }
        );

      console.log(

        "🟢 Session connected:",

        session.sessionId
      );

      ws.isAlive =
        true;

      // =====================================
      // HEARTBEAT
      // =====================================

      ws.on(
        "pong",
        () => {

          ws.isAlive =
            true;

          sessionManager.touchSession(
            ws.sessionId
          );
        }
      );

      // =====================================
      // HANDLERS
      // =====================================

      const handlers =
        createHandlers({

          ws,

          eventBus,

          taskManager,

          sessionManager,

          sender,

          runStress,

          activeRequests
        });

      ws.on(
        "message",
        handlers.onMessage
      );

      // =====================================
      // CLOSE
      // =====================================

      ws.on(
        "close",
        () => {

          console.log(

            "🔴 Session disconnected:",

            ws.sessionId
          );

          sessionManager.destroySession(
            ws.sessionId
          );
        }
      );

      // =====================================
      // ERROR
      // =====================================

      ws.on(
        "error",
        err => {

          console.log(

            "❌ WS error:",

            err.message
          );
        }
      );
    }
  );

  // =====================================
  // HEARTBEAT LOOP
  // =====================================

  startHeartbeatLoop({

    wss,

    sessionManager
  });

  // =====================================
  // EXPORT
  // =====================================

  return {

    wss,

    sender
  };
}

module.exports = {

  createWSServer
};
