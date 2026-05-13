// backend/gateway/runtime/state_store.js

const fs =
  require("fs");

const STATE_FILE =
  "./state.json";

function serializeRequests(
  obj
) {

  const clean = {};

  for (const id in obj) {

    const r =
      obj[id];

    clean[id] = {
      requestId:
        r.requestId,

      deviceId:
        r.deviceId,

      commandId:
        r.commandId,

      meta:
        r.meta,

      retries:
        r.retries,

      maxRetries:
        r.maxRetries,

      state:
        r.state,

      broadcastId:
        r.broadcastId
    };
  }

  return clean;
}

function saveState({

  pendingRequests,
  broadcastRequests
}) {

  fs.writeFileSync(
    STATE_FILE,

    JSON.stringify(
      {
        pendingRequests:
          serializeRequests(
            pendingRequests
          ),

        broadcastRequests
      },
      null,
      2
    )
  );
}

function loadState() {

  if (
    !fs.existsSync(
      STATE_FILE
    )
  ) {

    return {
      pendingRequests: {},
      broadcastRequests: {}
    };
  }

  const state =
    JSON.parse(
      fs.readFileSync(
        STATE_FILE
      )
    );

  console.log(
    "🦎 State restored"
  );

  return {
    pendingRequests:
      state.pendingRequests || {},

    broadcastRequests:
      state.broadcastRequests || {}
  };
}

module.exports = {
  saveState,
  loadState
};
