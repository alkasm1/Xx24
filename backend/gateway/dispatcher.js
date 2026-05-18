const {
  executeOpcode
} = require(
  "../runtime/execution/execute_opcode"
);

const {
  getQueueStats
} = require(
  "../runtime/resolver/execution_queue"
);

const {
  resolveOpcode
} = require(
  "../execution/resolve_opcode"
);

// =====================================
// DISPATCH
// =====================================

async function dispatch(

  device,

  opcode,

  meta = {}

) {

  // =====================================
  // RESOLVE OPCODE
  // =====================================

  const resolved =
    resolveOpcode({

      device,

      opcode
    });

  // =====================================
  // EXECUTE
  // =====================================

  return executeOpcode({

    device,

    opcode,

    descriptor:
      resolved.descriptor,

    profileId:
      resolved.profileId,

    meta
  });
}

// =====================================
// EXPORTS
// =====================================

module.exports = {

  dispatch,

  getDispatcherStats:
    getQueueStats
};
