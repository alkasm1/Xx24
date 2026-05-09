// frontend/app.js

const ws = new WebSocket(`ws://${location.hostname}:5001`);

const wsStatus = document.getElementById("wsStatus");
const resultBox = document.getElementById("opcodeResult");
const devicesBox = document.getElementById("devicesBox");
const logs = document.getElementById("logs");
const stressResults = document.getElementById("stressResults");

// فتح شاشة اختبار الضغط
const stressBtn = document.getElementById("openStress");
if (stressBtn) {
  stressBtn.onclick = () => {
    document.getElementById("stressScreen").style.display = "block";
  };
}

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

// تشغيل اختبار الضغط
function runStress(profile) {
  ws.send(JSON.stringify({
    type: "ui.stress.run",
    profile
  }));
  logs.textContent += `\n🔥 STRESS START → ${profile}`;
}

document.getElementById("runLight")?.addEventListener("click", () => runStress("light"));
document.getElementById("runMedium")?.addEventListener("click", () => runStress("medium"));
document.getElementById("runHeavy")?.addEventListener("click", () => runStress("heavy"));
document.getElementById("runExtreme")?.addEventListener("click", () => runStress("extreme"));
