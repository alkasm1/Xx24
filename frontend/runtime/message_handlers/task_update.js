// frontend/runtime/message_handlers/task_update.js

import {
  logLine
} from "../logger.js";

export function handleTaskUpdate(
  msg
) {

  if (!msg.task) {
    return;
  }

  logLine(
    `📡 TASK ${msg.task.id} → ${msg.task.status}`
  );
}
