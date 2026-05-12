// frontend/runtime/state.js

export const runtimeState = {

  ws: null,

  reconnectTimer: null,

  heartbeatTimer: null,

  stressRunning: false,

  activeRequests:
    new Set(),

  opcodeHistory: [],

  snapshot: {
    devices: [],
    metrics: {},
    sessions: [],
    activeTasks: [],
    broadcasts: {}
  }
};
