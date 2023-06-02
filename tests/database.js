const mongoose = require('mongoose')

function initializeTestDatabase() {
    mongoose.connect('mongodb://localhost:27017/testdboa')
        .then(result => {
            console.log('connected to test')
            console.log(result)
        })
        .catch(error => {
            console.log('failed to connect to test')
            console.log(error)
        })

}

initializeTestDatabase()