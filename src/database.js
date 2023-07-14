const mongoose = require('mongoose');

const { DATABASE_URI, DB_NAME } = require('./config/database');

const setup = require('./setup');

function databaseSetup() {
	mongoose.connect(DATABASE_URI)
		.then(() => {
			console.log(`Successfully connected to ${DB_NAME} mongodb database.`);
			setup.setup()
		})
		.catch(error => {
			console.error(error.message);
		});
}

module.exports = {
	databaseSetup
};
