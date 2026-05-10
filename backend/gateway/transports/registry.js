// backend/gateway/transports/registry.js

const adapters = new Map();

function register(
  name,
  adapter
) {
  if (
    !name ||
    typeof name !== "string"
  ) {
    throw new Error(
      "transport name must be a non-empty string"
    );
  }

  if (
    !adapter ||
    typeof adapter.execute !==
      "function"
  ) {
    throw new Error(
      `adapter for transport "${name}" must expose execute()`
    );
  }

  adapters.set(name, adapter);
}

function get(name) {
  if (!adapters.has(name)) {
    throw new Error(
      `Transport not registered: ${name}`
    );
  }

  return adapters.get(name);
}

function has(name) {
  return adapters.has(name);
}

function list() {
  return Array.from(
    adapters.keys()
  );
}

module.exports = {
  register,
  get,
  has,
  list
};
