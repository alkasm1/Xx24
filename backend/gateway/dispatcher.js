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

async function dispatch(
  device,
  opcode,
 meta = {}
) {

  return executeOpcode({
    device,
    opcode,
    meta
  });
}

module.exports = {
  dispatch,

  getDispatcherStats:
    getQueueStats
};
