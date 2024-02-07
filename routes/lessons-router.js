const lessonRouter = require('express').Router();
const { getAllLessons, getUserLessons, getUserLessonNotes } = require('../controllers/lessons.controller.js');
const { authenticateToken, requireAdmin } = require('../middleware/auth.middleware.js');

lessonRouter.get('/admin', authenticateToken, requireAdmin, getAllLessons);
lessonRouter.get('/', authenticateToken, getUserLessons);
lessonRouter.get('/notes', authenticateToken, getUserLessonNotes)



module.exports = lessonRouter;