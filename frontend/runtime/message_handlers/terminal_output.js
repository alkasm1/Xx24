// frontend/runtime/message_handlers/terminal_output.js

import {
  renderTerminalOutput
} from "../../renderers/terminal_renderer.js";

export function handleTerminalOutput(
  msg
) {

  renderTerminalOutput({
    requestId:
      msg.requestId,

    deviceId:
      msg.deviceId,

    command:
      msg.command,

    output:
      msg.output,

    error:
      msg.error
  });
}
