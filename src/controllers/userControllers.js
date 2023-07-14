const User = require('../models/User');
const Payload = require('../utility/Payload');


/**
 * GET method that gets a user defined by the userId url parameter
 * and returns a JSON object contain the user details
 *
 * @param request
 * @param response
 * @param next
 * @returns {Promise<*>}
 */
exports.get = async (request, response, next) => {

	// Get the users ID from query parameter
	const id = request.params.userId;

	let user; // User object will be stored here

	// Get user
	try {
		user = await User.findOne({_id: id});

		// User does not exist
		if (user == null) {
			const payload = new Payload(false, `User with the user id (${request.params.userId}) does not exist`);
			return response.status(404).json(payload);
		}
	}
	catch(error) {
		return next(error);
	}


	const payload = new Payload(true, 'Successfully retrieved user', user.getDetail());

	return response.status(200).json(payload);
};

/**
 * DELETE method that deletes a user defined by the user id in the
 * url parameter userId.
 *
 * @param request
 * @param response
 * @param next
 * @returns {Promise<*>}
 */
exports.delete = async (request, response, next) => {

	let user;

	// Try and delete use with the user id defined in request.params.userId
	try {
		user = await User.deleteOne({_id: request.params.userId});
	}
	catch(error) {
		return next(error);
	}

	if (user.deletedCount === 0) {
		// User does not exist
		const payload = new Payload(false, 'User Does not exists');
		payload.addError('id', `User with the ID ${request.params.userId} does not exist`);

		return response.status(404).json(payload);
	}

	return response.status(204).send();

};

/**
 * GET method that gets all users in the system. returns a
 * JSON object of all users
 *
 * @param request
 * @param response
 * @returns {Promise<*>}
 */
exports.list = async (request, response) => {

	const pageDefault = 1;
	const limitDefault = 10;

	let { page, limit } = request.query;

	page = Number.parseInt(page);
	limit = Number.parseInt(limit);

	// Validate query values
	const pageQueryParameterValid = page && Number.isSafeInteger(page) && page > 0;
	const limitQueryParameterValid = limit && Number.isSafeInteger(limit) && limit > 0;

	// No page query parameter found. Use default value
	if (!pageQueryParameterValid) {
		page = pageDefault;
	}

	// No limit query parameter found. Use default value
	if (!limitQueryParameterValid) {
		limit = limitDefault;
	}

	// Calculate how may documents need to be skipped
	const skipCount = (page - 1) * limit;

	// Get all users
	let users = await User.find().skip(skipCount).limit(limit);

	// serialize user objects
	users = users.map(user => user.getDetail());

	if (users.length === 0) {
		const payload = new Payload(true, 'There a are currently no users in the system');
		return response.status(204).json(payload);
	}

	const payload = new Payload(true, `Successfully retrieved ${users.length} users`, users);

	return response.status(200).json(payload);
};

/**
 * Partially updates a user object with the user data in the request body
 *
 * @param request
 * @param response
 * @param next
 * @returns {Promise<*>}
 */
exports.patch = async (request, response, next) => {

	// Get user ID from url parameter
	const userId = request.params.userId;

	let user; // user model

	try {
		user = await User.findById({_id: userId});

		if (!user) {
			const payload = new Payload(true, `User with the user id (${userId}) does not exist`);
			return response.status(404).json(payload);
		}
	}
	catch(error) {
		return next(error);
	}

	if (request.body.username) {
		const userExists = await User.exists(request.body.username);

		if (userExists) {
			const payload = new Payload(false, 'Username already exists');
			payload.addError('username', 'Username already exists');

			return response.status(409).json(payload);
		}
	}

	try {
		await User.findOneAndUpdate({_id: userId}, { $set: request.body }, { runValidators: true });
	}
	catch(error) {
		const payload = new Payload(false, error.message);
		return response.status(500).json(payload);
	}

	return response.status(204).send();
};
