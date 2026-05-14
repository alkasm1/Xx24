// backend/api/server.js

const express =
  require("express");

const cors =
  require("cors");

const path =
  require("path");

const router =
  require("./router");

function createAPIServer({

  port = 8000

} = {}) {

  const app =
    express();

  // =============================
  // MIDDLEWARE
  // =============================

  app.use(
    cors()
  );

  app.use(
    express.json({

      limit: "5mb"
    })
  );

  // =============================
  // API ROUTES
  // =============================

  app.use(
    "/api",
    router
  );

  // =============================
  // FRONTEND STATIC
  // =============================

  const frontendPath =
    path.join(

      __dirname,

      "../../frontend"
    );

  app.use(
    express.static(
      frontendPath
    )
  );

  // =============================
  // FALLBACK
  // =============================

  app.use((req, res) => {

    res.sendFile(

      path.join(

        frontendPath,

        "index.html"
      )
    );
  });

  // =============================
  // START SERVER
  // =============================

  app.listen(

    port,

    "0.0.0.0",

    () => {

      console.log(

        `🌐 API + Frontend running on http://0.0.0.0:${port}`
      );
    }
  );

  return app;
}

module.exports = {

  createAPIServer
};
