const express = require('express');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const authorizationMiddlewares = require('./middleware/authenticationMiddleware');
const errorHandlersMiddleware = require('./middleware/errorHandlersMiddleware');

const app = express();


app.use(express.json());
app.use('/auth', authRoutes);
app.use(authorizationMiddlewares.verifyToken);
app.use('/user', userRoutes);
app.use(errorHandlersMiddleware.json);
module.exports = app;

