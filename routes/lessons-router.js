const lessonRouter = require('express').Router();
const { getAllLessons, getUserLessons, getUserLessonsAndNotes, postLesson, postLessonNote, patchLessonNote } = require('../controllers/lessons.controller.js');
const { authenticateToken, requireAdmin } = require('../middleware/auth.middleware.js');

lessonRouter.get('/admin', authenticateToken, requireAdmin, getAllLessons);

lessonRouter.get('/:lesson_id/notes', authenticateToken, getUserLessonsAndNotes)

lessonRouter.route('/notes')
    .get(authenticateToken, getUserLessonsAndNotes)
    .post(authenticateToken, postLessonNote)
    .patch(authenticateToken, patchLessonNote);

lessonRouter.route('/')
    .get(authenticateToken, getUserLessons)
    .post(authenticateToken, postLesson)



module.exports = lessonRouter;