// stress/transports/udp.js

const dgram = require("dgram");
const socket = dgram.createSocket("udp4");

function sendUDP(payload) {
  return new Promise((resolve, reject) => {
    const msg = Buffer.from(JSON.stringify(payload));
    socket.send(msg, 41234, "127.0.0.1", err => err ? reject(err) : resolve());
  });
}

module.exports = { sendUDP };
