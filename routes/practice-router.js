const practiceRouter = require('express').Router();
const { getUserPractises, getUserPracticeNotes, postPractice, deletePracticeByPracticeId, postPracticeNote, patchPracticeNote } = require('../controllers/practises.controller.js');
const { authenticateToken } = require('../middleware/auth.middleware.js');

practiceRouter.get('/', authenticateToken, getUserPractises);
practiceRouter.get('/notes', authenticateToken, getUserPracticeNotes);
practiceRouter.get('/:practice_id/notes', authenticateToken, getUserPracticeNotes)


practiceRouter.post('/', authenticateToken, postPractice)
practiceRouter.delete('/:practice_id', authenticateToken, deletePracticeByPracticeId)
practiceRouter.post('/:practice_id/notes', authenticateToken, postPracticeNote)
practiceRouter.patch('/:practice_id/notes/:note_id', authenticateToken, patchPracticeNote)

module.exports = practiceRouter;