const practiceRouter = require('express').Router();
const { getUserPractises, getUserPracticeNotes, postPractice } = require('../controllers/practises.controller.js');
const { authenticateToken } = require('../middleware/auth.middleware.js');

practiceRouter.get('/', authenticateToken, getUserPractises);
practiceRouter.get('/notes', authenticateToken, getUserPracticeNotes);
practiceRouter.get('/:practice_id/notes', authenticateToken, getUserPracticeNotes)

practiceRouter.post('/', authenticateToken, postPractice)
module.exports = practiceRouter;