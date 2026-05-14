// frontend/ws_client.js

let ws = null;

let reconnectTimer = null;

let heartbeatTimer = null;

function startHeartbeat() {

  stopHeartbeat();

  heartbeatTimer =
    setInterval(() => {

      if (
        !ws ||
        ws.readyState !== WebSocket.OPEN
      ) {
        return;
      }

      ws.send(
        JSON.stringify({
          type: "ping",
          ts: Date.now()
        })
      );

    }, 10000);
}

function stopHeartbeat() {

  if (!heartbeatTimer) {
    return;
  }

  clearInterval(heartbeatTimer);

  heartbeatTimer = null;
}

function scheduleReconnect(onMessage, host) {

  if (reconnectTimer) {
    return;
  }

  reconnectTimer =
    setTimeout(() => {

      reconnectTimer = null;

      connectWS({
        host,
        onMessage
      });

    }, 2000);
}

function connectWS({

  host = location.hostname,

  port = 5001,

  onMessage

}) {

  const statusEl =
    document.getElementById(
      "wsStatus"
    );

  if (
    ws &&
    (
      ws.readyState === WebSocket.OPEN ||
      ws.readyState === WebSocket.CONNECTING
    )
  ) {

    return ws;
  }

  const wsURL =
    `ws://${host}:${port}`;

  console.log(
    "Connecting WS:",
    wsURL
  );

  ws = new WebSocket(wsURL);

  ws.onopen = () => {

    console.log(
      "WS connected"
    );

    if (statusEl) {

      statusEl.textContent =
        "WS: ✅ Connected";

      statusEl.style.background =
        "#16a34a";
    }

    startHeartbeat();
  };

  ws.onerror = err => {

    console.error(
      "WS error:",
      err
    );

    if (statusEl) {

      statusEl.textContent =
        "WS: ❌ Error";

      statusEl.style.background =
        "#dc2626";
    }
  };

  ws.onclose = () => {

    console.log(
      "WS closed"
    );

    stopHeartbeat();

    if (statusEl) {

      statusEl.textContent =
        "WS: ❌ Closed";

      statusEl.style.background =
        "#991b1b";
    }

    scheduleReconnect(
      onMessage,
      host
    );
  };

  ws.onmessage = event => {

    try {

      const data =
        JSON.parse(
          event.data
        );

      if (onMessage) {
        onMessage(data);
      }

    } catch (err) {

      console.error(
        "WS parse error:",
        err
      );
    }
  };

  return ws;
}

function sendWS(data) {

  if (
    !ws ||
    ws.readyState !== WebSocket.OPEN
  ) {

    console.error(
      "WS not connected"
    );

    return false;
  }

  ws.send(
    JSON.stringify(data)
  );

  return true;
}

export {
  connectWS,
  sendWS
};
