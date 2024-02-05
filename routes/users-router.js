const userRouter = require('express').Router();
const { getUsers, postUser } = require('../controllers/users.controller.js')
const { authenticateToken } = require('../middleware/auth.middleware.js')

userRouter.get('/', authenticateToken, getUsers)

userRouter.post('/', postUser)

module.exports = userRouter;