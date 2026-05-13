// backend/api/server.js

const express =
  require("express");

const cors =
  require("cors");

const router =
  require("./router");

function createAPIServer({

  port = 8080,

  host = "0.0.0.0"

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
  // ROOT
  // -----------------------------
  app.get(
    "/",
    (_, res) => {

      res.json({
        success: true,
        service: "alm-api-root"
      });
    }
  );

  // -----------------------------
  // START
  // -----------------------------
  app.listen(
    port,
    host,
    () => {

      console.log(
        `🌐 API server running on ${host}:${port}`
      );
    }
  );

  return app;
}

module.exports = {
  createAPIServer
};
