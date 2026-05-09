// /stress/transports/udp.js
import dgram from 'dgram';
const socket = dgram.createSocket('udp4');

export function sendUDP(payload) {
  return new Promise((resolve, reject) => {
    const msg = Buffer.from(JSON.stringify(payload));
    socket.send(msg, 41234, '127.0.0.1', err => err ? reject(err) : resolve());
  });
}
