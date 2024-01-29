const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { getLessons } = require('./controllers/lessons.controller');

const app = express();
const corsOptions = {credentials: true, origin: process.env.URL || '*'};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.get('/api/lessons', getLessons);

module.exports = app;