const mongoose = require('mongoose')

const { DATABASE_URI, DB_NAME } = require('./config/database')

function databaseSetup() {
    mongoose.connect(DATABASE_URI)
        .then(result => {
            console.log(`Successfully connected to ${DB_NAME} mongodb database.`)
        })
        .catch(error => {
            console.error(error.message)
        })
}

module.exports = {
    databaseSetup
}
