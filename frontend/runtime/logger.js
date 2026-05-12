// frontend/runtime/logger.js

const logs =
  document.getElementById(
    "logs"
  );

export function logLine(
  line
) {

  if (!logs) {
    return;
  }

  logs.textContent +=
    "\n" + line;

  logs.scrollTop =
    logs.scrollHeight;
}
