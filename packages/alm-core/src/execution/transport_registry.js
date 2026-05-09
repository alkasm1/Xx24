// packages/alm-core/src/execution/transport_registry.js

const transports = {};

function registerTransport(name, adapter) {
  transports[name] = adapter;
}

function getTransport(name) {
  return transports[name];
}

module.exports = {
  registerTransport,
  getTransport
};
