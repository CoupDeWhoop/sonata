const express = require('express');
const db = require('../db/connection.js');
const userRouter = require('./users-router.js');
const lessonRouter = require('./lessons-router.js')


const apiRouter = express.Router();

apiRouter.use('/users', userRouter);
apiRouter.use('/lessons', lessonRouter)

module.exports = apiRouter;