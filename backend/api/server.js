const express =
  require("express");

const cors =
  require("cors");

const path =
  require("path");

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
  // FRONTEND STATIC
  // -----------------------------
  app.use(
    express.static(
      path.join(
        process.cwd(),
        "frontend"
      )
    )
  );

  // -----------------------------
  // API ROUTES
  // -----------------------------
  app.use(
    "/api",
    router
  );

  // -----------------------------
  // INDEX
  // -----------------------------
  app.get(
    "/",
    (
      req,
      res
    ) => {

      res.sendFile(
        path.join(
          process.cwd(),
          "frontend",
          "index.html"
        )
      );
    }
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
