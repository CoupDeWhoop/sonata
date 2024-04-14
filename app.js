const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const apiRouter = require("./routes/api-router.js");

const app = express();
const corsOptions = { credentials: true, origin: process.env.URL || "*" };

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use("/api", apiRouter);

app.use((err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23502" || err.code === "22007") {
    res.status(400).send({ msg: "Invalid request" });
  }
  if (err.code === "23505") {
    res.status(400).send({ msg: "Bad request: duplicate entry" });
  }
  if (err.status) {
    res.status(err.status).send(err);
  }
  // catch any others
  res.status(500).send({ msg: "Internal Server Error" });
});

app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "Path not found." });
});

module.exports = app;
