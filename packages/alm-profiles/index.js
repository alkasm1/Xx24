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

// -----------------------------
// OPCODE RESOLVER (Phase 8)
// -----------------------------
function resolveOpcode(
  profileName,
  opcode
) {
  if (!profileName) {
    throw new Error(
      "Profile name is required"
    );
  }

  if (!opcode) {
    throw new Error(
      "Opcode is required"
    );
  }

  const profile =
    profiles[profileName];

  if (!profile) {
    throw new Error(
      `Unknown profile: ${profileName}`
    );
  }

  const parts =
    opcode.split(".");

  if (parts.length !== 2) {
    throw new Error(
      `Invalid opcode format: ${opcode}`
    );
  }

  const [
    namespace,
    method
  ] = parts;

  const namespaceModule =
    profile[namespace];

  if (!namespaceModule) {
    throw new Error(
      `Namespace not found: ${namespace}`
    );
  }

  const opcodeHandler =
    namespaceModule[method];

  if (
    typeof opcodeHandler !==
    "function"
  ) {
    throw new Error(
      `Opcode method not found: ${opcode}`
    );
  }

  return opcodeHandler;
}

// -----------------------------
// LIST OPCODES
// -----------------------------
function listOpcodes(
  profileName
) {
  const profile =
    profiles[profileName];

  if (!profile) {
    return [];
  }

  const result = [];

  for (const namespace of Object.keys(profile)) {
    const mod =
      profile[namespace];

    for (const method of Object.keys(mod)) {
      if (
        typeof mod[method] ===
        "function"
      ) {
        result.push(
          `${namespace}.${method}`
        );
      }
    }
  }

  return result;
}

module.exports = {
  profiles,

  getProfile,

  hasProfile,

  listProfiles,

  resolveOpcode,

  listOpcodes
};
