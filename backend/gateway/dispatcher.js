// backend/gateway/dispatcher.js

const opcodeRegistry = require("./opcodes/registry");

// المسار الصحيح حسب مشروعك:
const { executeOpcode } = require("../runtime/execution/execute_opcode");

const { getQueueStats } = require("../runtime/resolver/execution_queue");

// =====================================
// DISPATCH
// =====================================

async function dispatch(device, opcode, meta = {}) {

  // 1) جلب الوصف من registry الجديد
  const descriptor = opcodeRegistry.get(opcode);

  if (!descriptor) {
    throw new Error(`Opcode not found: ${opcode}`);
  }

  // 2) تنفيذ الأوبكود عبر executeOpcode القديم
  return executeOpcode({
    device,
    opcode,
    meta,
    descriptor
  });
}

// =====================================
// EXPORTS
// =====================================

module.exports = {
  dispatch,
  getDispatcherStats: getQueueStats
};
