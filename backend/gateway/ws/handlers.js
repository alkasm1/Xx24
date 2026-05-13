// backend/gateway/ws/handlers.js

const {
  executeTerminalCommand
} = require(
  "../terminal/terminal_executor"
);
const registry = require(
  "../device_registry"
);

function createHandlers({
  ws,
  eventBus,
  taskManager,
  sessionManager,
  sender,
  runStress,
  activeRequests
}) {

  async function onMessage(raw) {

    sessionManager.touchSession(
      ws.sessionId
    );

    let msg;

    try {

      msg = JSON.parse(
        raw.toString()
      );

    } catch {

      return;
    }

    // -----------------------------
    // UI HEARTBEAT
    // -----------------------------
    if (
      msg.type === "ping"
    ) {

      ws.send(
        JSON.stringify({
          type: "pong",
          ts: Date.now()
        })
      );

      return;
    }

    // -----------------------------
    // STRESS RUN
    // -----------------------------
    if (
      msg.type ===
      "ui.stress.run"
    ) {

      const profile =
        msg.profile ||
        "light";

      console.log(
        "🔥 UI requested stress run:",
        profile
      );

      try {

        const results =
          await runStress(
            profile
          );

        sender.broadcast({
          type:
            "stressUpdate",

          data: results
        });

      } catch (err) {

        console.log(
          "❌ Stress run failed:",
          err.message
        );
      }

      return;
    }

    // -----------------------------
    // OPCODE EXECUTION
    // -----------------------------
    if (
      msg.type ===
      "ui.opcode"
    ) {

      if (
        !msg.requestId
      ) {

        return sender.send(ws, {
          type:
            "opcode.result",

          result: {
            success: false,
            error:
              "Missing requestId"
          }
        });
      }

      if (
        activeRequests.has(
          msg.requestId
        )
      ) {

        console.log(
          "⚠ Duplicate request ignored:",
          msg.requestId
        );

        return;
      }

      activeRequests.add(
        msg.requestId
      );

      eventBus.emit(
        "opcode.received",
        msg
      );

      const device =
        registry.get(
          msg.deviceId
        );

      if (!device) {

        activeRequests.delete(
          msg.requestId
        );

        return sender.send(ws, {
          type:
            "opcode.result",

          requestId:
            msg.requestId,

          deviceId:
            msg.deviceId,

          opcode:
            msg.opcode,

          result: {
            success: false,
            error:
              `Device not found: ${msg.deviceId}`
          }
        });
      }

      try {

        const task =
          await taskManager.executeOpcode(
            {
              device,

              opcode:
                msg.opcode,

              meta:
                msg.meta || {},

              requestId:
                msg.requestId,

              sessionId:
                ws.sessionId
            }
          );

        sessionManager.attachTask(
          ws.sessionId,
          task.id
        );

        sender.send(ws, {
          type:
            "opcode.result",

          requestId:
            task.id,

          deviceId:
            task.deviceId,

          opcode:
            task.opcode,

          result:
            task.result
        });

      } catch (err) {

        eventBus.emit(
          "opcode.failed",
          msg
        );

        sender.send(ws, {
          type:
            "opcode.result",

          requestId:
            msg.requestId,

          deviceId:
            msg.deviceId,

          opcode:
            msg.opcode,

          result: {
            success: false,
            error:
              err.message
          }
        });

      } finally {

        activeRequests.delete(
          msg.requestId
        );
      }
    }
  }

  return {
    onMessage
  };
}

module.exports = {
  createHandlers
};
