// stress/load-generator.js

const { sendWS } = require("./transports/ws");
const { sendSSH } = require("./transports/ssh");
const { sendUDP } = require("./transports/udp");

async function startLoad(profile, metrics) {
  const { duration, rate, transport } = profile;

  const start = Date.now();
  const end = start + duration;

  while (Date.now() < end) {
    const batchStart = Date.now();

    for (let i = 0; i < rate; i++) {
      const payload = { opcode: "ping", ts: Date.now() };

      let sendFn =
        transport === "ws" ? sendWS :
        transport === "ssh" ? sendSSH :
        sendUDP;

      sendFn(payload)
        .then(() => metrics.ok())
        .catch(() => metrics.err());
    }

    const elapsed = Date.now() - batchStart;
    const sleep = Math.max(0, 1000 - elapsed);
    await new Promise(r => setTimeout(r, sleep));
  }
}

module.exports = { startLoad };
