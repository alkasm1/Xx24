const transportRegistry =
  require(
    "../../gateway/transports"
  );

function resolveTransport(
  transportName
) {

  if (!transportName) {
    throw new Error(
      "Transport name is required"
    );
  }

  const adapter =
    transportRegistry.get(
      transportName
    );

  if (!adapter) {
    throw new Error(
      `Transport adapter not found: ${transportName}`
    );
  }

  if (
    typeof adapter.execute !==
    "function"
  ) {
    throw new Error(
      `Invalid transport adapter: ${transportName}`
    );
  }

  return adapter;
}

module.exports = {
  resolveTransport
};
