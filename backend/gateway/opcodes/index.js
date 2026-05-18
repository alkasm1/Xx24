// backend/gateway/opcodes/index.js

const fs =
  require("fs");

const path =
  require("path");

// =====================================
// REGISTRY
// =====================================

const registry =
  new Map();

// =====================================
// LOAD DIRECTORY
// =====================================

function loadDirectory(
  dir
) {

  const items =
    fs.readdirSync(dir);

  for (
    const item of items
  ) {

    const fullPath =
      path.join(
        dir,
        item
      );

    const stat =
      fs.statSync(
        fullPath
      );

    // =================================
    // RECURSIVE DIRECTORY
    // =================================

    if (
      stat.isDirectory()
    ) {

      loadDirectory(
        fullPath
      );

      continue;
    }

    // =================================
    // JS FILES ONLY
    // =================================

    if (
      !item.endsWith(".js")
    ) {

      continue;
    }

    // ignore self
    if (
      item === "index.js" ||
      item === "registry.js"
    ) {

      continue;
    }

    // =================================
    // LOAD OPCODE
    // =================================

    const mod =
      require(fullPath);

    if (
      !mod ||
      !mod.opcode
    ) {

      console.log(
        "⚠ Invalid opcode module:",
        fullPath
      );

      continue;
    }

    registry.set(
      mod.opcode,
      mod
    );

    console.log(
      "⚡ Opcode loaded:",
      mod.opcode
    );
  }
}

// =====================================
// INIT
// =====================================

loadDirectory(
  __dirname
);

// =====================================
// API
// =====================================

function getOpcode(
  opcode
) {

  return registry.get(
    opcode
  );
}

function getAllOpcodes() {

  return Array.from(
    registry.values()
  );
}

function hasOpcode(
  opcode
) {

  return registry.has(
    opcode
  );
}

// =====================================
// EXPORT
// =====================================

module.exports = {

  registry,

  getOpcode,

  getAllOpcodes,

  hasOpcode
};
