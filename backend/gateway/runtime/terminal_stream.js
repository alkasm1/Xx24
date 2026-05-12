// backend/gateway/runtime/terminal_stream.js

const eventBus = require("../event_bus");

function initTerminalStream(sendToUI) {
  const originalLog = console.log;

  console.log = (...args) => {
    originalLog(...args);

    try {
      const payload = args
        .map(a => (typeof a === "object" ? JSON.stringify(a) : String(a)))
        .join(" ");

      sendToUI({
        type: "terminal",
        line: payload
      });
    } catch (_) {}
  };

  // Forward eventBus terminal logs if any
  eventBus.on("terminal.log", line => {
    sendToUI({
      type: "terminal",
      line
    });
  });
}

module.exports = initTerminalStream;
