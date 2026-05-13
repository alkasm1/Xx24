// backend/api/server.js

const express =
  require("express");

const cors =
  require("cors");

const router =
  require("./router");

function createAPIServer({

  port = 8080
} = {}) {

  const app =
    express();

  // -----------------------------
  // MIDDLEWARE
  // -----------------------------
  app.use(
    cors()
  );

  app.use(
    express.json({
      limit: "5mb"
    })
  );

  // -----------------------------
  // ROUTES
  // -----------------------------
  app.use(
    "/api",
    router
  );

  // -----------------------------
  // START
  // -----------------------------
  app.listen(
    port,
    () => {

      console.log(
        `🌐 API server running on :${port}`
      );
    }
  );

  return app;
}

module.exports = {
  createAPIServer
};
