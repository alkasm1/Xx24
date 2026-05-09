// stress/transports/ssh.js

function sendSSH() {
  return new Promise(resolve => setTimeout(resolve, 20));
}

module.exports = { sendSSH };
