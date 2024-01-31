const userRouter = require('express').Router();
const { getUsers, postUser } = require('../controllers/users.controller.js')

userRouter.get('/', getUsers)

userRouter.post('/', postUser)

module.exports = userRouter;