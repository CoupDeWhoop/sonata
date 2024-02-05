const authRouter = require('express').Router();
const { postLogin } = require('../controllers/auth.controller.js');

authRouter.post('/login', postLogin);

// authRouter.get()

module.exports = authRouter;