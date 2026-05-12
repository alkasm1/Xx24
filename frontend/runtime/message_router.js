// frontend/runtime/message_router.js

import {
  handleSnapshot
} from "./message_handlers/snapshot.js";

import {
  handleOpcodeResult
} from "./message_handlers/opcode_result.js";

import {
  handleTaskUpdate
} from "./message_handlers/task_update.js";

import {
  handleStressUpdate
} from "./message_handlers/stress_update.js";

import {
  handleTerminal
} from "./message_handlers/terminal.js";

const handlers = {

  snapshot:
    handleSnapshot,

  "opcode.result":
    handleOpcodeResult,

  "task.update":
    handleTaskUpdate,

  stressUpdate:
    handleStressUpdate,

  terminal:
    handleTerminal
};

export function routeMessage(
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

  if (!handler) {
    return;
  }

  handler(msg);
}
