const lessonRouter = require('express').Router();
const { getAllLessons, getUserLessons, getUserLessonNotes, postLesson, postLessonNote } = require('../controllers/lessons.controller.js');
const { authenticateToken, requireAdmin } = require('../middleware/auth.middleware.js');

lessonRouter.get('/admin', authenticateToken, requireAdmin, getAllLessons);
lessonRouter.get('/', authenticateToken, getUserLessons);
lessonRouter.get('/notes', authenticateToken, getUserLessonNotes)
lessonRouter.get('/:lesson_id/notes', authenticateToken, getUserLessonNotes)

lessonRouter.post('/', authenticateToken, postLesson)
lessonRouter.post('/notes', authenticateToken, postLessonNote)



module.exports = lessonRouter;