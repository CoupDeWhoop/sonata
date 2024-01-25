const express = require('express');
const { getLessons } = require('./controllers/lessons.controller')

const app = express();

app.get('/api/lessons', getLessons);

module.exports = app;