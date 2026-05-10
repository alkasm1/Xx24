const dgram = require("dgram");
const crypto = require("crypto");

const GATEWAY_PORT = 41234;
const GATEWAY_IP = "127.0.0.1";
const SECRET = "alm_shared_secret";

function stableStringify(obj) {
  if (obj === null || typeof obj !== "object") return JSON.stringify(obj);
  if (Array.isArray(obj)) return "[" + obj.map(stableStringify).join(",") + "]";
  return "{" + Object.keys(obj).sort().map(k => JSON.stringify(k) + ":" + stableStringify(obj[k])).join(",") + "}";
}

function signPacket(packet) {
  return crypto.createHmac("sha256", SECRET).update(stableStringify(packet)).digest("hex");
}

function genNonce() {
  return crypto.randomBytes(8).toString("hex");
}

// -----------------------------
// إنشاء 10 أجهزة وهمية
// -----------------------------
for (let i = 1; i <= 10; i++) {
  const DEVICE_ID = `fake-${i}`;
  const PORT = 6000 + i;

  const socket = dgram.createSocket("udp4");
  socket.bind(PORT);

  console.log(`🤖 Fake device started → ${DEVICE_ID} (port ${PORT})`);

  // إرسال heartbeat كل ثانية
  setInterval(() => {
    const hb = {
      type: "heartbeat",
      deviceId: DEVICE_ID,
      ts: Date.now(),
      nonce: genNonce()
    };

    const base = { ...hb };
    hb.sig = signPacket(base);

    socket.send(Buffer.from(JSON.stringify(hb)), GATEWAY_PORT, GATEWAY_IP);
  }, 1000);

  // استقبال الأوامر من الـ Gateway
  socket.on("message", (msg) => {
    let packet;
    try { packet = JSON.parse(msg.toString()); } catch { return; }

    const ack = {
      type: "ack",
      requestId: packet.requestId,
      deviceId: DEVICE_ID,
      commandId: packet.commandId,
      ts: Date.now(),
      nonce: genNonce(),
      execMs: Math.floor(Math.random() * 20) + 5
    };

    const base = { ...ack };
    ack.sig = signPacket(base);

    socket.send(Buffer.from(JSON.stringify(ack)), GATEWAY_PORT, GATEWAY_IP);
  });
}
