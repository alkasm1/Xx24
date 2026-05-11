// packages/alm-profiles/index.js

const mikrotikSystem = require(
  "./mikrotik/system"
);

const mikrotikWifi = require(
  "./mikrotik/wifi"
);

const linuxSystem = require(
  "./linux/system"
);

// -----------------------------
// PROFILE REGISTRY
// -----------------------------
const profiles = {
  routeros: {
    system:
      mikrotikSystem,

    wifi:
      mikrotikWifi
  },

  linux: {
    system:
      linuxSystem
  }
};

// -----------------------------
// HELPERS
// -----------------------------
function getProfile(
  profile
) {
  return (
    profiles[profile] ||
    null
  );
}

function hasProfile(
  profile
) {
  return Boolean(
    profiles[profile]
  );
}

function listProfiles() {
  return Object.keys(
    profiles
  );
}

module.exports = {
  profiles,

  getProfile,

  hasProfile,

  listProfiles
};
