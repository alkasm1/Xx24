// backend/gateway/ws/sender.js

const WebSocket = require("ws");

function createSender(wss) {

  function send(ws, payload) {

    if (!ws) {
      return;
    }

    if (
      ws.readyState !==
      WebSocket.OPEN
    ) {
      return;
    }

    try {

      ws.send(
        JSON.stringify(payload)
      );

    } catch (_) {}
  }

  function broadcast(payload) {

    const data =
      JSON.stringify(payload);

    wss.clients.forEach(ws => {

      if (
        ws.readyState ===
        WebSocket.OPEN
      ) {

        ws.send(data);
      }
    });
  }

  return {
    send,
    broadcast
  };
}

module.exports = {
  createSender
};
