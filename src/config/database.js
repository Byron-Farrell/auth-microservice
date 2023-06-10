require('dotenv').config();

/**
 * Database username used to authenticate the database connection
 *
 * @type {string}
 */
const DB_USERNAME = process.env.DB_USERNAME;

/**
 * Database password used to authenticate the database connection
 *
 * @type {string}
 */
const DB_PASSWORD = process.env.DB_PASSWORD;

/**
 * The name of the database that is to be connected to
 *
 * @type {string}
 */
const DB_NAME = process.env.DB_NAME;

/**
 * The port number the database is running on
 *
 * @type {string}
 */
const DB_PORT = process.env.DB_PORT;

/**
 * The host name or IP address of the database
 *
 * @type {string}
 */
const DB_HOST = process.env.DB_HOST;

/**
 *  Database connection URI
 *
 * @type {string}
 */
const DATABASE_URI = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`;

/**
 * Exported variables.
 *
 * @type {Object}
 * @property {string} DB_NAME - Database name
 * @property {string} DB_PORT - Port database is running on
 * @property {string} DB_HOST - Host or IP address of database
 * @property {string} DATABASE_URI - Database connection URI
 */
module.exports = {
	DB_NAME,
	DB_PORT,
	DB_HOST,
	DATABASE_URI
};