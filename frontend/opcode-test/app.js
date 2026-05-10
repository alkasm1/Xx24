// frontend/opcode-test/app.js


const wsStatus = document.getElementById("wsStatus");
const resultBox = document.getElementById("opcodeResult");
const devicesBox = document.getElementById("devicesBox");
const logs = document.getElementById("logs");

ws.onopen = () => {
  wsStatus.textContent = "WS: ✅ متصل";
  wsStatus.style.background = "#0a0";
};

ws.onclose = () => {
  wsStatus.textContent = "WS: ❌ غير متصل";
  wsStatus.style.background = "#a00";
};

const handlers = {
  "opcode.result": (msg) => {
    resultBox.textContent = JSON.stringify(msg, null, 2);
  },
  "snapshot": (msg) => {
    devicesBox.textContent = JSON.stringify(msg.devices, null, 2);
  }
};

ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);

  const handler = handlers[msg.type];
  if (handler) handler(msg);

  logs.textContent += `\n${event.data}`;
  logs.scrollTop = logs.scrollHeight;
};

function sendOpcode() {
  const deviceId = document.getElementById("opcodeDevice").value;
  const opcode = document.getElementById("opcodeInput").value;

  const req = {
    type: "ui.opcode",
    requestId: "req-" + Math.random().toString(36).slice(2),
    deviceId,
    opcode,
    meta: {}
  };

  ws.send(JSON.stringify(req));
  logs.textContent += `\n📤 SENT OPCODE → ${opcode}`;
}
