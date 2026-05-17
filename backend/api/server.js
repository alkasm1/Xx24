// backend/api/server.js

const express =
  require("express");

const cors =
  require("cors");

const path =
  require("path");

const http =
  require("http");

const router =
  require("./router");

function createAPIServer({

  port = 8000

} = {}) {

  // =====================================
  // EXPRESS
  // =====================================

  const app =
    express();

  // =====================================
  // MIDDLEWARE
  // =====================================

  app.use(
    cors()
  );

  app.use(
    express.json({

      limit: "5mb"
    })
  );

  // =====================================
  // API
  // =====================================

  app.use(
    "/api",
    router
  );

  // =====================================
  // FRONTEND PATH
  // =====================================

  const frontendPath =
    path.join(

      process.cwd(),

      "frontend"
    );

  console.log(
    "📁 Frontend:",
    frontendPath
  );

  // =====================================
  // STATIC
  // =====================================

  app.use(
    express.static(
      frontendPath
    )
  );

  // =====================================
  // INDEX ROUTE ONLY
  // =====================================

  app.get(
    "/",
    (req, res) => {

      res.sendFile(

        path.join(

          frontendPath,

          "index.html"
        )
      );
    }
  );

  // =====================================
  // HTTP SERVER
  // =====================================

  const server =
  http.createServer(app);

server.on("listening", () => {

  console.log(
    "SERVER ADDRESS:",
    server.address()
  );
});

  // =====================================
  // START
  // =====================================

  server.listen(

    port,

    "0.0.0.0",

    () => {

      console.log(

        `🌐 API + Frontend running on http://0.0.0.0:${port}`
      );
    }
  );

  // =====================================
  // EXPORT
  // =====================================

  return {

    app,

    server
  };
}

module.exports = {

  createAPIServer
};
