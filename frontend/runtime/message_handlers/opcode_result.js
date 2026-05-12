import {
  runtimeState
} from "../state.js";

import {
  logLine
} from "../logger.js";

export function handleOpcodeResult(
  msg
) {

  const resultBox =
    document.getElementById(
      "opcodeResult"
    );

  if (resultBox) {

    resultBox.textContent =
      JSON.stringify(
        msg,
        null,
        2
      );
  }

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

  logLine(
    `✅ OPCODE RESULT → ${msg.opcode}`
  );
}
