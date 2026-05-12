// frontend/app.js

import {
  connectWS
} from "./ws_client.js";

import {
  routeMessage
} from "./runtime/message_router.js";

connectWS({
  onMessage:
    routeMessage
});
