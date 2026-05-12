// backend/gateway/ws/heartbeat.js

function startHeartbeatLoop({
  wss,
  sessionManager,
  intervalMs = 15000
}) {

  return setInterval(() => {

    wss.clients.forEach(ws => {

      if (
        ws.isAlive === false
      ) {

        console.log(
          "💀 WS heartbeat timeout:",
          ws.sessionId
        );

        sessionManager.destroySession(
          ws.sessionId
        );

        return ws.terminate();
      }

      ws.isAlive = false;

      try {

        ws.ping();

      } catch (_) {}
    });

  }, intervalMs);
}

module.exports = {
  startHeartbeatLoop
};
