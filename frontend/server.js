const express =
  require("express");

const path =
  require("path");

const app =
  express();

const PORT =
  8080;

// -----------------------------
// STATIC FRONTEND
// -----------------------------
app.use(
  express.static(
    path.join(__dirname)
  )
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
        __dirname,
        "index.html"
      )
    );
  }
);

// -----------------------------
// START
// -----------------------------
app.listen(
  PORT,
  "0.0.0.0",
  () => {

    console.log(
      `🖥 Frontend running on :${PORT}`
    );
  }
);
