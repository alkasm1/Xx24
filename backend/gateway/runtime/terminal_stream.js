const eventBus = require(
  "../event_bus"
);

function stringify(arg) {

  if (
    typeof arg === "object"
  ) {

    try {

      return JSON.stringify(
        arg,
        null,
        2
      );

    } catch {

      return "[object]";
    }
  }

  return String(arg);
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
            stringify
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

  // =====================================
  // EVENT BUS TERMINAL LOGS
  // =====================================

  eventBus.on(
    "terminal.log",
    (line) => {

      sendToUI({

        type:
          "terminal",

        line
      });
    }
  );
}

module.exports =
  initTerminalStream;
