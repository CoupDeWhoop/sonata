const express = require('express');
const userRouter = require('./users-router.js');
const lessonRouter = require('./lessons-router.js');
const authRouter = require('./auth-router.js');
const { getEndpoints } = require('../controllers/app.controller.js')


const apiRouter = express.Router();


apiRouter.use('/auth', authRouter);
apiRouter.use('/users', userRouter);
apiRouter.use('/lessons', lessonRouter);

apiRouter.get('/', getEndpoints);

module.exports = apiRouter;