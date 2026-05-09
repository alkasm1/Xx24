// packages/alm-gateway/src/transports/ws/ws_server.js

const WebSocket = require("ws");

const Queue = require(
  "../../../alm-core/src/runtime/queue"
);
const registry = require(
  "../../../alm-core/src/registry/device_registry"
);
const dispatch = require(
  "../../orchestrator/dispatcher"
);

const queue = new Queue({
  concurrency: 4
});

function startWSServer(server) {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", ws => {
    ws.on("message", msg => {
      let data;

      try {
        data = JSON.parse(msg);
      } catch (err) {
        return ws.send(
          JSON.stringify({
            type: "error",
            message: "Invalid JSON"
          })
        );
      }

      if (data.type !== "ui.opcode") {
        return;
      }

      const requestId = data.requestId || null;

      const device = registry.get(data.deviceId);

      if (!device) {
        return ws.send(
          JSON.stringify({
            type: "opcode.result",
            requestId,
            deviceId: data.deviceId,
            opcode: data.opcode,
            result: {
              success: false,
              error: `Unknown device: ${data.deviceId}`
            }
          })
        );
      }

      queue.push(async () => {
        try {
          const result = await dispatch(
            device,
            data.opcode,
            data.meta || {}
          );

          ws.send(
            JSON.stringify({
              type: "opcode.result",
              requestId,
              deviceId: device.deviceId,
              opcode: data.opcode,
              result: {
                success: true,
                output:
                  typeof result === "string"
                    ? result
                    : JSON.stringify(result)
              }
            })
          );
        } catch (err) {
          ws.send(
            JSON.stringify({
              type: "opcode.result",
              requestId,
              deviceId: device.deviceId,
              opcode: data.opcode,
              result: {
                success: false,
                error: err.message
              }
            })
          );
        }
      });
    });
  });

  console.log("WS server ready");
}

module.exports = startWSServer;
