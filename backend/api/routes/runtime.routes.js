// backend/api/routes/runtime.routes.js

const express =
  require("express");

const router =
  express.Router();

const controller =
  require(
    "../controllers/runtime.controller"
  );

// -----------------------------
// SNAPSHOT
// -----------------------------
router.get(
  "/snapshot",
  controller.getSnapshot
);

// -----------------------------
// DEVICES
// -----------------------------
router.get(
  "/devices",
  controller.getDevices
);

// -----------------------------
// SINGLE DEVICE
// -----------------------------
router.get(
  "/devices/:id",
  controller.getDevice
);

module.exports =
  router;
