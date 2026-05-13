// backend/api/router.js

const express =
  require("express");

const runtimeRoutes =
  require(
    "./routes/runtime.routes"
  );

const router =
  express.Router();

// -----------------------------
// HEALTH
// -----------------------------
router.get(
  "/health",
  (
    req,
    res
  ) => {

    res.json({
      success: true,
      service: "alm-api",
      ts: Date.now()
    });
  }
);

// -----------------------------
// RUNTIME
// -----------------------------
router.use(
  "/runtime",
  runtimeRoutes
);

module.exports =
  router;
