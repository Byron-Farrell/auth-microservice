const express = require('express')
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const { PORT } = require('./config/server')
const { databaseSetup } = require('./database')
const authorizationMiddlewares = require('./middleware/authenticationMiddleware')

databaseSetup()

const app = express()

app.use(express.json())

app.use('/auth', authRoutes)
// app.use(authorizationMiddlewares.verifyToken)
app.use('/user', userRoutes)


app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})