const eventBus =
  require("../event_bus");

function stringify(arg) {

  if (
    typeof arg === "string"
  ) {
    return arg;
  }

  try {

    return JSON.stringify(
      arg,
      null,
      2
    );

  } catch {

    return String(arg);
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
          .map(stringify)
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
    line => {

      sendToUI({

        type:
          "terminal",

        line:
          stringify(line)
      });
    }
  );
}

module.exports =
  initTerminalStream;
