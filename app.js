const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const apiRouter = require('./routes/api-router.js')

const app = express();
const corsOptions = {credentials: true, origin: process.env.URL || '*'};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use('/api', apiRouter);

module.exports = app;