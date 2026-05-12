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
        ws.readyState !==
          WebSocket.OPEN
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

  clearInterval(
    heartbeatTimer
  );

  heartbeatTimer =
    null;
}

function scheduleReconnect(
  onMessage
) {

  if (reconnectTimer) {
    return;
  }

  reconnectTimer =
    setTimeout(() => {

      reconnectTimer =
        null;

      connectWS({
        onMessage
      });

    }, 2000);
}

function connectWS({
  onMessage
}) {

  const statusEl =
    document.getElementById(
      "wsStatus"
    );

  if (
    ws &&
    (
      ws.readyState ===
        WebSocket.OPEN ||

      ws.readyState ===
        WebSocket.CONNECTING
    )
  ) {

    return ws;
  }

  ws =
    new WebSocket(
      `ws://${location.hostname}:5001`
    );

  ws.onopen = () => {

    if (statusEl) {

      statusEl.textContent =
        "WS: ✅ Connected";

      statusEl.style.background =
        "#0a0";
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
        "#a00";
    }
  };

  ws.onclose = () => {

    stopHeartbeat();

    if (statusEl) {

      statusEl.textContent =
        "WS: ❌ Closed";

      statusEl.style.background =
        "#a00";
    }

    scheduleReconnect(
      onMessage
    );
  };

  ws.onmessage = event => {

    try {

      const data =
        JSON.parse(
          event.data
        );

      onMessage(data);

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
    ws.readyState !==
      WebSocket.OPEN
  ) {

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
