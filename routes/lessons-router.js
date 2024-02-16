const lessonRouter = require('express').Router();
const { getAllLessons, getUserLessons, getUserLessonNotes, postLesson } = require('../controllers/lessons.controller.js');
const { authenticateToken, requireAdmin } = require('../middleware/auth.middleware.js');

lessonRouter.get('/admin', authenticateToken, requireAdmin, getAllLessons);
lessonRouter.get('/', authenticateToken, getUserLessons);
lessonRouter.get('/notes', authenticateToken, getUserLessonNotes)
lessonRouter.get('/notes/:lesson_id', authenticateToken, getUserLessonNotes)

lessonRouter.post('/', authenticateToken, postLesson)



module.exports = lessonRouter;