// frontend/runtime/message_handlers/terminal.js

export function handleTerminal(
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
    "\n" + msg.line;

  logs.scrollTop =
    logs.scrollHeight;
}
