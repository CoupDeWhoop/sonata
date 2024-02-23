const practiceRouter = require('express').Router();
const { getUserPractises, getUserPracticeNotes, postPractice, postPracticeNote, patchPracticeNote } = require('../controllers/practises.controller.js');
const { authenticateToken } = require('../middleware/auth.middleware.js');
const { authenticateUser } = require('../models/auth.model.js');

practiceRouter.get('/', authenticateToken, getUserPractises);
practiceRouter.get('/notes', authenticateToken, getUserPracticeNotes);
practiceRouter.get('/:practice_id/notes', authenticateToken, getUserPracticeNotes)

practiceRouter.post('/', authenticateToken, postPractice)
practiceRouter.post('/:practice_id/notes', authenticateToken, postPracticeNote)
practiceRouter.patch('/:practice_id/notes', authenticateToken, patchPracticeNote)

module.exports = practiceRouter;