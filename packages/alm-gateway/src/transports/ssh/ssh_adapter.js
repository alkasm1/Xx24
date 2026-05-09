// packages/alm-gateway/src/transports/ssh/ssh_adapter.js

const execSSH = require("./ssh_exec");

module.exports = {
  async run(device, descriptor) {
    return execSSH({
      host: device.ip,
      port: device.port,
      username: device.username,
      password: device.password,
      command: descriptor.command,
      timeout: descriptor.timeout || 5000
    });
  }
};
