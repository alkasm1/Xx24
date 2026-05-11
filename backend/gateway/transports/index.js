// backend/gateway/transports/index.js

const registry = require(
  "./registry"
);

const sshAdapter = require(
  "./ssh_adapter"
);

// -----------------------------
// REGISTER TRANSPORTS
// -----------------------------
registry.register(
  "ssh",
  sshAdapter
);

// -----------------------------
// SAFE GET
// -----------------------------
function get(name) {
  const adapter =
    registry.get(name);

  if (!adapter) {
    throw new Error(
      `Transport not registered: ${name}`
    );
  }

  return adapter;
}

// -----------------------------
// LIST
// -----------------------------
function list() {
  return registry.list
    ? registry.list()
    : [];
}

module.exports = {
  register:
    registry.register,

  unregister:
    registry.unregister,

  get,

  list
};
