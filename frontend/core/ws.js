import { CONFIG }
from "./config.js";

import { state }
from "./state.js";

export function connectWS({

  onMessage,

  onOpen,

  onClose

}) {

  const ws =
    new WebSocket(
      CONFIG.wsURL
    );

  state.ws = ws;

  ws.onopen = () => {

    state.connected = true;

    onOpen?.();
  };

  ws.onclose = () => {

    state.connected = false;

    onClose?.();

    setTimeout(() => {

      connectWS({
        onMessage,
        onOpen,
        onClose
      });

    }, 2000);
  };

  ws.onmessage = event => {

    try {

      const data =
        JSON.parse(
          event.data
        );

      onMessage?.(data);

    } catch (err) {

      console.error(err);
    }
  };
}

export function sendWS(data) {

  if (

    !state.ws ||

    state.ws.readyState !==
      WebSocket.OPEN

  ) {

    return false;
  }

  state.ws.send(
    JSON.stringify(data)
  );

  return true;
}
