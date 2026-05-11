// packages/alm-profiles/mikrotik/wifi.js

function validateChannel(
  channel
) {
  const ch = Number(channel);

  if (
    Number.isNaN(ch) ||
    ch < 1 ||
    ch > 165
  ) {
    throw new Error(
      `Invalid WiFi channel: ${channel}`
    );
  }

  return ch;
}

function buildCommand(
  command,
  timeout = 5000
) {
  return {
    type: "command",

    transport: "ssh",

    payload: {
      command
    },

    timeout,

    parser: "text"
  };
}

module.exports = {
  // -----------------------------
  // SET CHANNEL
  // -----------------------------
  setChannel(
    meta = {}
  ) {
    const iface =
      meta.interface ||
      "wlan1";

    const ch =
      validateChannel(
        meta.channel || 1
      );

    return buildCommand(
      `/interface wireless set ${iface} channel=${ch}`
    );
  },

  // -----------------------------
  // GET STATIONS
  // -----------------------------
  getStations(
    meta = {}
  ) {
    const iface =
      meta.interface ||
      "wlan1";

    return buildCommand(
      `/interface wireless registration-table print where interface=${iface}`
    );
  },

  // -----------------------------
  // ENABLE WIFI
  // -----------------------------
  enableWifi(
    meta = {}
  ) {
    const iface =
      meta.interface ||
      "wlan1";

    return buildCommand(
      `/interface wireless enable ${iface}`
    );
  },

  // -----------------------------
  // DISABLE WIFI
  // -----------------------------
  disableWifi(
    meta = {}
  ) {
    const iface =
      meta.interface ||
      "wlan1";

    return buildCommand(
      `/interface wireless disable ${iface}`
    );
  },

  // -----------------------------
  // GET WIFI STATUS
  // -----------------------------
  getStatus(
    meta = {}
  ) {
    const iface =
      meta.interface ||
      "wlan1";

    return buildCommand(
      `/interface wireless print detail where name=${iface}`
    );
  }
};
