const express = require('express');
const userRouter = require('./users-router.js');
const lessonRouter = require('./lessons-router.js');
const authRouter = require('./auth-router.js');
const practiceRouter = require('./practice-router.js');
const { getEndpoints } = require('../controllers/app.controller.js');


const apiRouter = express.Router();


apiRouter.use('/auth', authRouter);
apiRouter.use('/users', userRouter);
apiRouter.use('/lessons', lessonRouter);
apiRouter.use('/practises', practiceRouter);

apiRouter.get('/', getEndpoints);

module.exports = apiRouter;