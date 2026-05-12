// frontend/ws_client.js

import {
  runtimeState
} from "./runtime/state.js";

import {
  logLine
} from "./runtime/logger.js";

const wsStatus =
  document.getElementById(
    "wsStatus"
  );

export function connectWS({
  onOpen,
  onClose,
  onMessage,
  onError
}) {

  if (
    runtimeState.ws &&
    (
      runtimeState.ws.readyState ===
        WebSocket.OPEN ||

      runtimeState.ws.readyState ===
        WebSocket.CONNECTING
    )
  ) {
    return runtimeState.ws;
  }

  const ws =
    new WebSocket(
      `ws://${location.hostname}:5001`
    );

  runtimeState.ws =
    ws;

  ws.onopen = () => {

    if (wsStatus) {

      wsStatus.innerText =
        "WS: ✅ connected";

      wsStatus.style.background =
        "#0a0";
    }

    logLine(
      "🟢 WS connected"
    );

    if (onOpen) {
      onOpen(ws);
    }
  };

  ws.onclose = () => {

    if (wsStatus) {

      wsStatus.innerText =
        "WS: ❌ disconnected";

      wsStatus.style.background =
        "#a00";
    }

    logLine(
      "🔴 WS disconnected"
    );

    if (onClose) {
      onClose();
    }
  };

  ws.onerror = err => {

    logLine(
      "❌ WS error"
    );

    if (onError) {
      onError(err);
    }
  };

  ws.onmessage = event => {

    let msg = null;

    try {

      msg =
        JSON.parse(
          event.data
        );

    } catch {

      return;
    }

    if (onMessage) {
      onMessage(msg);
    }
  };

  return ws;
}
