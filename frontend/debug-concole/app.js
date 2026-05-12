import {
  connectWS
} from "../ws_client.js";

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

let ws = null;

// -----------------------------
// LOG
// -----------------------------
function logLine(
  line
) {

  logs.textContent +=
    "\n" + line;

  logs.scrollTop =
    logs.scrollHeight;
}

// -----------------------------
// WS
// -----------------------------
ws = connectWS({

  onMessage(msg) {

    // OPCODE RESULT
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
    }

    // SNAPSHOT
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

    logLine(
      JSON.stringify(msg)
    );
  },

  onOpen() {

    wsStatus.textContent =
      "WS: ✅ متصل";

    wsStatus.style.background =
      "#0a0";
  },

  onClose() {

    wsStatus.textContent =
      "WS: ❌ غير متصل";

    wsStatus.style.background =
      "#a00";
  }
});

// -----------------------------
// SEND OPCODE
// -----------------------------
function sendOpcode() {

  if (
    !ws ||
    ws.readyState !==
      WebSocket.OPEN
  ) {

    logLine(
      "❌ WS غير متصل"
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

  const req = {

    type:
      "ui.opcode",

    requestId:
      "req_" +
      Math.random()
        .toString(36)
        .slice(2),

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

window.sendOpcode =
  sendOpcode;
