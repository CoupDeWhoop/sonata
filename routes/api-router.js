const express = require('express');
const userRouter = require('./users-router.js');
const lessonRouter = require('./lessons-router.js');
const authRouter = require('./auth-router.js');


const apiRouter = express.Router();

apiRouter.use('/login', authRouter);
apiRouter.use('/users', userRouter);
apiRouter.use('/lessons', lessonRouter);


module.exports = apiRouter;