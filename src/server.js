const { databaseSetup } = require('./database')
const { PORT } = require('./config/server');
const app = require('./app')

databaseSetup()

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})