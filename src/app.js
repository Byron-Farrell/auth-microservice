const express = require('express');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const authorizationMiddlewares = require('./middleware/authenticationMiddleware');
const errorHandlersMiddleware = require('./middleware/errorHandlersMiddleware');
const validationMiddleware = require('./middleware/validationMiddleware');

const app = express();


app.use(express.json());
// app.use(validationMiddleware.validations)
app.use(authRoutes);
app.use(authorizationMiddlewares.verifyToken);
app.use(userRoutes);
app.use(errorHandlersMiddleware.json);

module.exports = app;

