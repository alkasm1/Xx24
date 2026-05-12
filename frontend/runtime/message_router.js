// frontend/runtime/message_router.js

import {
  handleOpcodeResult
} from "./message_handlers/opcode_result.js";

import {
  handleSnapshot
} from "./message_handlers/snapshot.js";

import {
  handleStressUpdate
} from "./message_handlers/stress_update.js";

import {
  handleTerminal
} from "./message_handlers/terminal.js";

import {
  handleTaskUpdate
} from "./message_handlers/task_update.js";

const handlers = {

  "opcode.result":
    handleOpcodeResult,

  "snapshot":
    handleSnapshot,

  "stressUpdate":
    handleStressUpdate,

  "terminal":
    handleTerminal,

  "task.update":
    handleTaskUpdate
};

function routeMessage(
  msg
) {

  if (
    !msg ||
    !msg.type
  ) {
    return;
  }

  const handler =
    handlers[msg.type];

  if (handler) {
    handler(msg);
  }
}

export {
  routeMessage
};
