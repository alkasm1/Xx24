// packages/alm-gateway/src/bootstrap/register_transports.js

const {
  registerTransport
} = require("../../../../alm-core/src/execution/transport_registry");

const sshAdapter = require(
  "../transports/ssh/ssh_adapter"
);

registerTransport("ssh", sshAdapter);
