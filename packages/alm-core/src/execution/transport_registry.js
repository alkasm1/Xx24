// packages/alm-core/src/execution/transport_registry.js

const transports = {};

// -----------------------------
// REGISTER
// -----------------------------
function registerTransport(
  name,
  adapter
) {
  if (!name) {
    throw new Error(
      "Transport name is required"
    );
  }

  const fn =
    adapter &&
    (
      typeof adapter.run ===
        "function" ||
      typeof adapter.execute ===
        "function"
    );

  if (!fn) {
    throw new Error(
      `Invalid adapter for transport: ${name}`
    );
  }

  transports[name] = adapter;

  return adapter;
}

// -----------------------------
// GET
// -----------------------------
function getTransport(
  name
) {
  return (
    transports[name] ||
    null
  );
}

// -----------------------------
// EXISTS
// -----------------------------
function hasTransport(
  name
) {
  return Boolean(
    transports[name]
  );
}

// -----------------------------
// UNREGISTER
// -----------------------------
function unregisterTransport(
  name
) {
  delete transports[name];
}

// -----------------------------
// LIST
// -----------------------------
function getAllTransports() {
  return Object.keys(
    transports
  );
}

// -----------------------------
// SNAPSHOT
// -----------------------------
function snapshot() {
  return getAllTransports().map(
    name => ({
      name,

      methods:
        Object.keys(
          transports[name]
        )
    })
  );
}

module.exports = {
  registerTransport,

  getTransport,

  hasTransport,

  unregisterTransport,

  getAllTransports,

  snapshot
};
