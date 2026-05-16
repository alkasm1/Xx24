
const linuxProfile =
  require("./profiles/linux.profile");

// =====================================
// REGISTRY
// =====================================

const profiles =
  new Map();

// =====================================
// REGISTER
// =====================================

function registerProfile(
  profile
) {

  if (
    !profile ||
    !profile.id
  ) {

    throw new Error(
      "Invalid profile"
    );
  }

  profiles.set(
    profile.id,
    profile
  );
}

// =====================================
// GET
// =====================================

function getProfile(
  id
) {

  return profiles.get(id);
}

// =====================================
// GET OPCODE
// =====================================

function getOpcode({

  profileId,

  opcode
}) {

  const profile =
    getProfile(
      profileId
    );

  if (!profile) {
    return null;
  }

  return (
    profile.opcodes?.[
      opcode
    ] || null
  );
}

// =====================================
// REGISTER DEFAULTS
// =====================================

registerProfile(
  linuxProfile
);

// =====================================

module.exports = {

  registerProfile,

  getProfile,

  getOpcode
};
