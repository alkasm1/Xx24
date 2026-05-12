// frontend/runtime/message_handlers/opcode_result.js

import {
  runtimeState
} from "../state.js";

import {
  renderOpcodeResult
} from "../../renderers/opcode_renderer.js";

import {
  logLine
} from "../logger.js";

export function handleOpcodeResult(
  msg
) {

  runtimeState.activeRequests.delete(
    msg.requestId
  );

  runtimeState.opcodeHistory.push({

    requestId:
      msg.requestId,

    deviceId:
      msg.deviceId,

    opcode:
      msg.opcode,

    result:
      msg.result,

    ts:
      Date.now()
  });

  renderOpcodeResult(
    msg
  );

  logLine(
    `✅ OPCODE RESULT → ${msg.opcode}`
  );
}
