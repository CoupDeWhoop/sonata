const authRouter = require("express").Router();
const {
  postLogin,
  getRefreshToken,
} = require("../controllers/auth.controller.js");

authRouter.post("/login", postLogin);

authRouter.get("/refresh-token", getRefreshToken);

module.exports = authRouter;
