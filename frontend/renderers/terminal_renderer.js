// frontend/renderers/terminal_renderer.js

const logs =
  document.getElementById(
    "logs"
  );

export function renderTerminalOutput(
  payload
) {

  if (!logs) {
    return;
  }

  const lines = [];

  lines.push(
    "\n🖥 TERMINAL EXEC"
  );

  lines.push(
    `DEVICE: ${payload.deviceId}`
  );

  lines.push(
    `COMMAND: ${payload.command}`
  );

  if (payload.error) {

    lines.push(
      `ERROR: ${payload.error}`
    );

  } else {

    lines.push(
      "OUTPUT:"
    );

    lines.push(
      payload.output || ""
    );
  }

  lines.push(
    "-----------------------------------"
  );

  logs.textContent +=
    "\n" +
    lines.join("\n");

  logs.scrollTop =
    logs.scrollHeight;
}
