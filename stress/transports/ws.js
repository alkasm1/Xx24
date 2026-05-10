// stress/transports/ws.js

const WebSocket = require("ws");

function sendWS(payload) {
  return new Promise((resolve, reject) => {
    if (ws.readyState !== 1) return reject();
    ws.send(JSON.stringify(payload), err => err ? reject(err) : resolve());
  });
}

module.exports = { sendWS };
