// stress/transports/ws.js

const WebSocket = require("ws");

const ws = new WebSocket("ws://127.0.0.1:5001");

function sendWS(payload) {
  return new Promise((resolve, reject) => {
    if (ws.readyState !== 1) return reject();
    ws.send(JSON.stringify(payload), err => err ? reject(err) : resolve());
  });
}

module.exports = { sendWS };
