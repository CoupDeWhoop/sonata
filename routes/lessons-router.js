const lessonRouter = require('express').Router();
const { getAllLessons, getUserLessons, getUserLessonNotes, postLesson, postLessonNote, patchLessonNote } = require('../controllers/lessons.controller.js');
const { authenticateToken, requireAdmin } = require('../middleware/auth.middleware.js');

lessonRouter.get('/admin', authenticateToken, requireAdmin, getAllLessons);

lessonRouter.get('/:lesson_id/notes', authenticateToken, getUserLessonNotes)

lessonRouter.route('/notes')
    .get(authenticateToken, getUserLessonNotes)
    .post(authenticateToken, postLessonNote)
    .patch(authenticateToken, patchLessonNote);

lessonRouter.route('/')
    .get(authenticateToken, getUserLessons)
    .post(authenticateToken, postLesson)



module.exports = lessonRouter;