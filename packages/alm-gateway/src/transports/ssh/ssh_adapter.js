// packages/alm-gateway/src/transports/ssh/ssh_adapter.js

const execSSH = require("./ssh_exec");

module.exports = {
  async run(device, descriptor) {
    if (
      !descriptor.payload ||
      !descriptor.payload.command
    ) {
      throw new Error(
        "SSH descriptor missing payload.command"
      );
    }

    return execSSH({
      host: device.ip,
      port: device.port,
      username: device.username,
      password: device.password,

      command: descriptor.payload.command,

      timeout: descriptor.timeout || 5000
    });
  }
};
