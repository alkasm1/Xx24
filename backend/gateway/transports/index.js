// backend/gateway/transports/index.js

const registry = require(
  "./registry"
);

const sshAdapter = require(
  "./ssh_adapter"
);

// register transports
registry.register(
  "ssh",
  sshAdapter
);

module.exports = registry;
