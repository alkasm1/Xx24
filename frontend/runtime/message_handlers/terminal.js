// frontend/runtime/message_handlers/terminal.js

import {
  logLine
} from "../logger.js";

export function handleTerminal(
  msg
) {

  if (!msg.line) {
    return;
  }

  logLine(
    msg.line
  );
}
