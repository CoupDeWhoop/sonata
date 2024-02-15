const practiceRouter = require('express').Router();
const { getUserPractises } = require('../controllers/practises.controller.js');
const { authenticateToken } = require('../middleware/auth.middleware.js');

practiceRouter.get('/', authenticateToken, getUserPractises)

module.exports = practiceRouter;