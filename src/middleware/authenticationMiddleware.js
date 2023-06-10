
const jwt = require('jsonwebtoken');
const Payload = require('../models/Payload');
const authConfig = require('../config/auth');

/**
 * Middleware that validates a JSON web token. If the token
 * is not valid a 401 response will be sent to the client.
 *
 * @param request
 * @param response
 * @param next
 * @returns {Promise<*>}
 */
exports.verifyToken = async (request, response, next) => {

	const authorizationHeader = request.headers.authorization;

	// Missing authorization header
	if (!authorizationHeader) {
		let payload = new Payload(false, 'Missing authorization header');

		return response.status(401).json(payload);
	}

	// Getting JSON web token string from authorization header
	const token = authorizationHeader.split(' ')[1];

	// Validate JSON web token
	try {
		await jwt.verify(token, authConfig.JWT_SECRET_KEY);
	} catch (error) {
		// invalid JSON web token
		let payload = new Payload(false, error.message);
		return response.status(401).json(payload);
	}

	// JSON web token is valid
	next();
};