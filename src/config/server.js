require('dotenv').config();

/**
 * Port number the application will be listening to
 *
 * @type {string}
 */
const PORT = process.env.PORT;


/**
 * Exported variables.
 *
 * @type {Object}
 * @property {string} PORT - Port number the application will be listening to
 */
module.exports = {
	PORT,
};