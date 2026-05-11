// frontend/app.js

let ws = null;

let reconnectTimer = null;

let heartbeatTimer = null;

const activeRequests =
  new Set();

let stressRunning =
  false;

// -----------------------------
// UI ELEMENTS
// -----------------------------
const wsStatus =
  document.getElementById(
    "wsStatus"
  );

const resultBox =
  document.getElementById(
    "opcodeResult"
  );

const devicesBox =
  document.getElementById(
    "devicesBox"
  );

const logs =
  document.getElementById(
    "logs"
  );

const stressResults =
  document.getElementById(
    "stressResults"
  );

// -----------------------------
// LOGGING
// -----------------------------
function logLine(line) {
  logs.textContent +=
    "\n" + line;

  logs.scrollTop =
    logs.scrollHeight;
}

// -----------------------------
// WS HEARTBEAT
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

  if (heartbeatTimer) {

    clearInterval(
      heartbeatTimer
    );

    heartbeatTimer = null;
  }
}

// -----------------------------
// WS CONNECT
// -----------------------------
function connectWS() {

  ws = new WebSocket(
    `ws://${location.hostname}:5001`
  );

  // -----------------------------
  // OPEN
  // -----------------------------
  ws.onopen = () => {

    wsStatus.innerText =
      "WS: ✅ connected";

    wsStatus.style.background =
      "#0a0";

    logLine(
      "🟢 WS connected"
    );

    startHeartbeat();
  };

  // -----------------------------
  // CLOSE
  // -----------------------------
  ws.onclose = () => {

    wsStatus.innerText =
      "WS: ❌ disconnected";

    wsStatus.style.background =
      "#a00";

    logLine(
      "🔴 WS disconnected"
    );

    stopHeartbeat();

    scheduleReconnect();
  };

  // -----------------------------
  // ERROR
  // -----------------------------
  ws.onerror = err => {

    logLine(
      "❌ WS error"
    );
  };

  // -----------------------------
  // MESSAGE
  // -----------------------------
  ws.onmessage = event => {

    let msg;

    try {

      msg = JSON.parse(
        event.data
      );

    } catch {

      return;
    }

    // -----------------------------
    // PONG
    // -----------------------------
    if (
      msg.type === "pong"
    ) {

      return;
    }

    // -----------------------------
    // OPCODE RESULT
    // -----------------------------
    if (
      msg.type ===
      "opcode.result"
    ) {

      resultBox.textContent =
        JSON.stringify(
          msg,
          null,
          2
        );

      activeRequests.delete(
        msg.requestId
      );
    }

    // -----------------------------
    // SNAPSHOT
    // -----------------------------
    if (
      msg.type ===
      "snapshot"
    ) {

      devicesBox.textContent =
        JSON.stringify(
          msg.devices,
          null,
          2
        );
    }

    // -----------------------------
    // STRESS RESULTS
    // -----------------------------
    if (
      msg.type ===
      "stressUpdate"
    ) {

      stressResults.textContent =
        JSON.stringify(
          msg.data,
          null,
          2
        );

      stressRunning = false;
    }

    // -----------------------------
    // TERMINAL STREAM
    // -----------------------------
    if (
      msg.type ===
      "terminal"
    ) {

      logLine(msg.line);

      return;
    }

    logLine(event.data);
  };
}

// -----------------------------
// WS RECONNECT
// -----------------------------
function scheduleReconnect() {

  if (reconnectTimer) {
    return;
  }

  reconnectTimer =
    setTimeout(() => {

      reconnectTimer =
        null;

      logLine(
        "🔄 Reconnecting WS..."
      );

      connectWS();

    }, 2000);
}

// -----------------------------
// OPCODE EXECUTION
// -----------------------------
function sendOpcode() {

  if (
    !ws ||
    ws.readyState !==
      WebSocket.OPEN
  ) {

    logLine(
      "❌ WS not connected"
    );

    return;
  }

  const deviceId =
    document.getElementById(
      "opcodeDevice"
    ).value;

  const opcode =
    document.getElementById(
      "opcodeInput"
    ).value;

  if (!deviceId) {

    logLine(
      "❌ Missing deviceId"
    );

    return;
  }

  if (!opcode) {

    logLine(
      "❌ Missing opcode"
    );

    return;
  }

  const requestId =
    "req_" +
    Math.random()
      .toString(36)
      .slice(2);

  // -----------------------------
  // REQUEST DEDUPE
  // -----------------------------
  if (
    activeRequests.has(
      requestId
    )
  ) {

    logLine(
      "⚠ Duplicate request blocked"
    );

    return;
  }

  activeRequests.add(
    requestId
  );

  const req = {
    type: "ui.opcode",

    requestId,

    deviceId,

    opcode,

    meta: {}
  };

  ws.send(
    JSON.stringify(req)
  );

  logLine(
    `📤 OPCODE → ${opcode}`
  );
}

// -----------------------------
// STRESS RUNNER
// -----------------------------
function runStress(
  profile
) {

  if (
    !ws ||
    ws.readyState !==
      WebSocket.OPEN
  ) {

    logLine(
      "❌ WS not connected"
    );

    return;
  }

  if (stressRunning) {

    logLine(
      "⚠ Stress already running"
    );

    return;
  }

  stressRunning =
    true;

  ws.send(
    JSON.stringify({
      type:
        "ui.stress.run",

      profile
    })
  );

  logLine(
    `🔥 STRESS START → ${profile}`
  );
}

// -----------------------------
// STRESS BUTTONS
// -----------------------------
document
  .getElementById(
    "runLight"
  )
  ?.addEventListener(
    "click",
    () =>
      runStress("light")
  );

document
  .getElementById(
    "runMedium"
  )
  ?.addEventListener(
    "click",
    () =>
      runStress("medium")
  );

document
  .getElementById(
    "runHeavy"
  )
  ?.addEventListener(
    "click",
    () =>
      runStress("heavy")
  );

document
  .getElementById(
    "runExtreme"
  )
  ?.addEventListener(
    "click",
    () =>
      runStress("extreme")
  );

// -----------------------------
// START
// -----------------------------
connectWS();
