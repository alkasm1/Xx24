// frontend/runtime/message_handlers/task_update.js

export function handleTaskUpdate(
  msg
) {

  const logs =
    document.getElementById(
      "logs"
    );

  if (!logs) {
    return;
  }

  logs.textContent +=
    `\n📡 TASK ${msg.task.id} → ${msg.task.status}`;

  logs.scrollTop =
    logs.scrollHeight;
}
