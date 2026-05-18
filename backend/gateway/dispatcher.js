// backend/gateway/dispatcher.js

const opcodeRegistry = require("./opcodes/registry");
const { executeOpcode } = require("./runtime/execution/execute_opcode");
const { getQueueStats } = require("./runtime/resolver/execution_queue");

// =====================================
// DISPATCH
// =====================================

async function dispatch(device, opcode, meta = {}) {

  // 1) جلب الوصف من registry الجديد
  const descriptor = opcodeRegistry.get(opcode);

  if (!descriptor) {
    throw new Error(`Opcode not found: ${opcode}`);
  }

  // 2) تنفيذ الأوبكود
  return executeOpcode({
    device,
    opcode,
    descriptor,
    profileId: descriptor.profile || "default",
    meta
  });
}

// =====================================
// EXPORTS
// =====================================

module.exports = {
  dispatch,
  getDispatcherStats: getQueueStats
};
