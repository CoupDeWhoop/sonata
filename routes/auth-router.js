const authRouter = require('express').Router();
const { postLogin } = require('../controllers/auth.controller.js');

authRouter.post('/', postLogin);

module.exports = authRouter;