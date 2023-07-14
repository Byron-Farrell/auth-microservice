const mongoose = require('mongoose');
const { DATABASE_URI, DB_NAME } = require('../config/database');

module.exports = function () {
	return mongoose.connect(DATABASE_URI)
		.then(() => {
			console.log(`Successfully connected to ${DB_NAME} mongodb database.`);
		})
		.catch(error => {
			console.error(error.message);
		});
}