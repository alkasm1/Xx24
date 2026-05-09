// packages/alm-core/src/execution/transport_registry.js

const transports = {};

function registerTransport(name, adapter) {
  if (!name) {
    throw new Error("Transport name is required");
  }

  if (!adapter || typeof adapter.run !== "function") {
    throw new Error(
      `Invalid adapter for transport: ${name}`
    );
  }

  transports[name] = adapter;
}

function getTransport(name) {
  return transports[name] || null;
}

function unregisterTransport(name) {
  delete transports[name];
}

function getAllTransports() {
  return Object.keys(transports);
}

module.exports = {
  registerTransport,
  getTransport,
  unregisterTransport,
  getAllTransports
};
