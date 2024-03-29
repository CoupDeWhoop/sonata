const userRouter = require("express").Router();
const { getUsers, postUser } = require("../controllers/users.controller.js");
const {
  authenticateToken,
  requireAdmin,
} = require("../middleware/auth.middleware.js");

userRouter.get("/", authenticateToken, requireAdmin, getUsers);

userRouter.post("/", postUser);

module.exports = userRouter;
