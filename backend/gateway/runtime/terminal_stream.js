// backend/gateway/runtime/terminal_stream.js

const eventBus =
  require("../event_bus");

function safeSerialize(v) {

  if (
    typeof v === "string"
  ) {
    return v;
  }

  try {

    return JSON.stringify(
      v,
      null,
      2
    );

  } catch (_) {

    return String(v);
  }
}

function initTerminalStream(
  sendToUI
) {

  const originalLog =
    console.log;

  console.log = (
    ...args
  ) => {

    originalLog(...args);

    try {

      const payload =
        args
          .map(
            safeSerialize
          )
          .join(" ");

      sendToUI({

        type:
          "terminal",

        line:
          payload
      });

    } catch (_) {}
  };

  // =========================
  // EVENT BUS TERMINAL
  // =========================

  eventBus.on(
    "terminal.log",
    line => {

      sendToUI({

        type:
          "terminal",

        line:
          safeSerialize(
            line
          )
      });
    }
  );
}

module.exports =
  initTerminalStream;
