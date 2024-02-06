const lessonRouter = require('express').Router();
const { getAllLessons, getLessons } = require('../controllers/lessons.controller.js');
const { authenticateToken, requireAdmin } = require('../middleware/auth.middleware.js');

lessonRouter.get('/admin', authenticateToken, requireAdmin, getAllLessons);
lessonRouter.get('/', authenticateToken, getLessons);



module.exports = lessonRouter;