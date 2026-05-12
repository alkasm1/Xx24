// backend/gateway/ws/server.js

const WebSocket = require("ws");

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
  port = 5001,
  host = "0.0.0.0",

  eventBus,
  taskManager,
  sessionManager,
  runStress,

  activeRequests
}) {

  const wss =
    new WebSocket.Server({
      port,
      host
    });

  const sender =
    createSender(wss);

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

      ws.isAlive = true;

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

  startHeartbeatLoop({
    wss,
    sessionManager
  });

  return {
    wss,
    sender
  };
}

module.exports = {
  createWSServer
};
