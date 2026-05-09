// frontend/app.js

const ws = new WebSocket("ws://192.168.88.245:5001");

const wsStatus = document.getElementById("wsStatus");
const resultBox = document.getElementById("opcodeResult");
const devicesBox = document.getElementById("devicesBox");
const logs = document.getElementById("logs");
const stressResults = document.getElementById("stressResults");

// فتح شاشة اختبار الضغط
document.getElementById("openStress").onclick = () => {
  document.getElementById("stressScreen").style.display = "block";
};

ws.onopen = () => {
  wsStatus.innerText = "WS: ✅ connected";
  wsStatus.style.background = "#0a0";
};

ws.onclose = () => {
  wsStatus.innerText = "WS: ❌ disconnected";
  wsStatus.style.background = "#a00";
};

ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);

  if (msg.type === "opcode.result") {
    resultBox.textContent = JSON.stringify(msg, null, 2);
  }

  if (msg.type === "snapshot") {
    devicesBox.textContent = JSON.stringify(msg.devices, null, 2);
  }

  // استقبال نتائج الضغط من الـ Gateway
  if (msg.type === "stressUpdate") {
    stressResults.textContent = JSON.stringify(msg.data, null, 2);
  }

  logs.textContent += "\n" + event.data;
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
  logs.textContent += "\n📤 SENT OPCODE → " + opcode;
}

// تشغيل اختبار الضغط عبر Gateway
function runStress(profile) {
  fetch(`/stress/run?profile=${profile}`)
    .then(r => r.json())
    .then(data => {
      stressResults.textContent = JSON.stringify(data, null, 2);
    });
}

document.getElementById("runLight").onclick = () => runStress("light");
document.getElementById("runMedium").onclick = () => runStress("medium");
document.getElementById("runHeavy").onclick = () => runStress("heavy");
document.getElementById("runExtreme").onclick = () => runStress("extreme");
