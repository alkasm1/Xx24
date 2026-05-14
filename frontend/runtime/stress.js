import {
  sendWS
}
from "../core/ws.js";

export function runStress(
  level
) {

  sendWS({

    type:
      "stress.run",

    level
  });
}
