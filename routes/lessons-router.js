const lessonRouter = require('express').Router();
const { getLessons } = require('../controllers/lessons.controller.js');

lessonRouter.get('/', getLessons);


module.exports = lessonRouter;