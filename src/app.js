const express = require('express')
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const authorizationMiddlewares = require('./middleware/authenticationMiddleware')

const app = express()

app.use(express.json())
app.use('/auth', authRoutes)
app.use(authorizationMiddlewares.verifyToken)
app.use('/user', userRoutes)

module.exports = app

