export const CONFIG = {

  API_PORT: 8000,

  WS_PORT: 5001,

  get apiBase() {

    return `http://${location.hostname}:${this.API_PORT}`;
  },

  get wsURL() {

    return `ws://${location.hostname}:${this.WS_PORT}`;
  }
};
