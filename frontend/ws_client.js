let ws = null;

let reconnectTimer =
  null;

let heartbeatTimer =
  null;

// -----------------------------
// HEARTBEAT
// -----------------------------
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

// -----------------------------
// RECONNECT
// -----------------------------
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

// -----------------------------
// CONNECT
// -----------------------------
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
      `ws://${host}:5001`
    );

  // -----------------------------
  // OPEN
  // -----------------------------
  ws.onopen = () => {

    console.log(
      "WS connected"
    );

    if (statusEl) {

      statusEl.textContent =
        "WS: ✅ Connected";

      statusEl.style.background =
        "#15803d";
    }

    startHeartbeat();
  };

  // -----------------------------
  // ERROR
  // -----------------------------
  ws.onerror = err => {

    console.error(
      "WS error:",
      err
    );

    if (statusEl) {

      statusEl.textContent =
        "WS: ❌ Error";

      statusEl.style.background =
        "#b91c1c";
    }
  };

  // -----------------------------
  // CLOSE
  // -----------------------------
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
      onMessage
    );
  };

  // -----------------------------
  // MESSAGE
  // -----------------------------
  ws.onmessage = event => {

    try {

      const data =
        JSON.parse(
          event.data
        );

      console.log(
        "WS message:",
        data
      );

      // -----------------------------
      // STRESS RESULT
      // -----------------------------
      if (
        data.type ===
        "stressUpdate"
      ) {

        const el =
          document.getElementById(
            "stressResults"
          );

        if (el) {

          el.textContent =
            JSON.stringify(
              data.data,
              null,
              2
            );
        }
      }

      // -----------------------------
      // ROUTE
      // -----------------------------
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

// -----------------------------
// SEND
// -----------------------------
function sendWS(data) {

  if (

    !ws ||

    ws.readyState !==
      WebSocket.OPEN
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
