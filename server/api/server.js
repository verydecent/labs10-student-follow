const express = require('express');
const configureMiddleware = require('../middleware/globalMiddleware');
const server = express();

configureMiddleware(server);

const teachersRoutes = require('../routes/teachersRoutes');
const studentsRoutes = require('../routes/studentsRoutes');
const classesRoutes = require('../routes/classesRoutes');
const questionsRoutes = require('../routes/questionsRoutes');
const refreshrRoutes = require('../routes/refreshrRoutes');

server.use('/classes', classesRoutes);
server.use('/teachers', teachersRoutes);
server.use('/students', studentsRoutes);
server.use('/questions', questionsRoutes);
server.use('/refreshr', refreshrRoutes);

module.exports = server;