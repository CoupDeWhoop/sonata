const express = require("express");
const noteRouter = express.Router();
const { authenticateToken } = require("../middleware/auth.middleware.js");
const { getAllNotes } = require("../controllers/notes.controller.js");

noteRouter.get("/", authenticateToken, getAllNotes);

module.exports = noteRouter;
