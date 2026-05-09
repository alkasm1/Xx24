// /stress/transports/ssh.js
export function sendSSH(payload) {
  return new Promise((resolve) => {
    // mock SSH latency
    setTimeout(resolve, 20);
  });
}
