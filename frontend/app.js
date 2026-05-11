// frontend/app.js

let ws = null;

let reconnectTimer = null;

const activeRequests =
  new Set();

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
// WS CONNECT
// -----------------------------
function connectWS() {
  ws = new WebSocket(
    `ws://${location.hostname}:5001`
  );

  ws.onopen = () => {
    wsStatus.innerText =
      "WS: ✅ connected";

    wsStatus.style.background =
      "#0a0";

    logLine(
      "🟢 WS connected"
    );
  };

  ws.onclose = () => {
    wsStatus.innerText =
      "WS: ❌ disconnected";

    wsStatus.style.background =
      "#a00";

    logLine(
      "🔴 WS disconnected"
    );

    scheduleReconnect();
  };

  ws.onmessage = event => {
    const msg = JSON.parse(
      event.data
    );

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
    }

    logLine(event.data);
  };

  // heartbeat
  setInterval(() => {
    if (
      ws.readyState === 1
    ) {
      ws.send(
        JSON.stringify({
          type: "ping"
        })
      );
    }
  }, 10000);
}

// -----------------------------
// RECONNECT
// -----------------------------
function scheduleReconnect() {
  if (reconnectTimer) {
    return;
  }

  reconnectTimer =
    setTimeout(() => {
      reconnectTimer = null;
      connectWS();
    }, 2000);
}

// -----------------------------
// LOG
// -----------------------------
function logLine(line) {
  logs.textContent +=
    "\n" + line;

  logs.scrollTop =
    logs.scrollHeight;
}

// -----------------------------
// OPCODE
// -----------------------------
function sendOpcode() {
  if (
    !ws ||
    ws.readyState !== 1
  ) {
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

  const requestId =
    "req_" +
    Math.random()
      .toString(36)
      .slice(2);

  // dedupe
  if (
    activeRequests.has(
      requestId
    )
  ) {
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
// STRESS
// -----------------------------
let stressRunning =
  false;

function runStress(profile) {
  if (
    !ws ||
    ws.readyState !== 1
  ) {
    return;
  }

  if (stressRunning) {
    return;
  }

  stressRunning = true;

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

  setTimeout(() => {
    stressRunning = false;
  }, 3000);
}

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

// start
connectWS();
