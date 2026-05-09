// /stress/transports/ws.js
import WebSocket from 'ws';

const ws = new WebSocket('ws://localhost:9000');

export function sendWS(payload) {
  return new Promise((resolve, reject) => {
    if (ws.readyState !== 1) return reject();
    ws.send(JSON.stringify(payload), err => err ? reject(err) : resolve());
  });
}
