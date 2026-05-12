const {
  resolveOpcode
} = require(
  "../../../packages/alm-profiles"
);

function resolveOpcodeHandler({
  profile,
  opcode
}) {

  if (!profile) {
    throw new Error(
      "Profile is required"
    );
  }

  if (!opcode) {
    throw new Error(
      "Opcode is required"
    );
  }

  const handler =
    resolveOpcode(
      profile,
      opcode
    );

  if (
    typeof handler !==
    "function"
  ) {
    throw new Error(
      `Invalid opcode handler: ${opcode}`
    );
  }

  return handler;
}

module.exports = {
  resolveOpcodeHandler
};
