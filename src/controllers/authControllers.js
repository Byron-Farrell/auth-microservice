const User = require('../models/User');
const Payload = require('../models/Payload');

/**
 * A POST method that takes a JSON object and validates the user information in said object.
 * If all validations pass, a JSON web token will be sent back to the client containing some
 * of the users account information.
 *
 * Expected JSON object format
 * {
 *     username: string,
 *     password: string
 * }
 *
 * @param request
 * @param response
 * @returns {Promise<*>}
 */
exports.login = async (request, response) => {

	const { username, password } = request.body;

	// Checking if required fields exist
	if (!username || !password) {
		// Missing field(s). Create an error payload
		const payload = new Payload(false, 'Validation error. Missing fields');

		// Missing user field in body
		if (!username) {
			payload.addError('username', 'username is a required field');
		}

		// Missing password field in body
		if (!password) {
			payload.addError('password', 'password is a required field');
		}

		return response.status(404).json(payload);
	}

	let user; // user object retrieved from database

	// Check if user exists
	try {
		// Getting user object based on the username in request.body
		user = await User.findOne({username});


		if (user === null) {
			// user does not exist. Create error payload
			const payload = new Payload(false, `username ${username} does not exist`);
			payload.addError('username', 'username does not exist');

			return response.status(404).json(payload);
		}
	} catch (error) {
		// Unexpected error occurred
		const payload = new Payload(false, error.message);
		return response.status(500).json(payload);
	}

	// Validate password in request.body
	try {
		// Hashes password and compares it to the user.password hash
		const match = await user.comparePasswords(password);

		if (!match) {
			// passwords do not match. Create error payload
			const payload = new Payload(false, 'Incorrect password');
			payload.addError('password', 'incorrect password');

			return response.status(401).json(payload);
		}
	} catch (error) {
		// Unexpected error occurred
		const payload = new Payload(false, error.message);
		return response.status(500).json(payload);
	}


	let token; // JSON web token

	// Create and sign JSON web token
	try {
		token = await user.generateToken();
	} catch (error) {
		// Unexpected error
		const payload = new Payload(false, error.message);
		return response.status(500).json(payload);
	}

	// Login successful. All checks passed.
	const payload = new Payload(true, 'Login successful', token);
	return response.status(200).json(payload);
};


/**
 * A POST method that expects a JSON object with fields that define a user model.
 * Validates the data, encrypts the password and responses with a JSON object containing
 * the newly created user details.
 *
 * Expected JSON object format
 * {
 *     username: string,
 *     password: string
 * }
 *
 * @param request
 * @param response
 * @returns {Promise<*>}
 */
exports.register = async (request, response) => {

	const { username, password } = request.body;

	// Checking if required fields exist
	if (!username || !password) {
		// Missing field(s). Create an error payload
		const payload = new Payload(false, 'Validation error. Missing fields');

		// Missing user field in body
		if (!username) {
			payload.addError('username', 'username is a required field');
		}

		// Missing password field in body
		if (!password) {
			payload.addError('password', 'password is a required field');
		}

		return response.status(404).json(payload);
	}

	// Check is username is taken
	try {
		// user with the request.body.username already exists
		if (await User.exists(username)) {
			const payload = new Payload(false, 'Username Already exists');
			payload.addError(
				'username',
				`a user with the username ${username} already exists`
			);

			return response.status(409).json(payload);
		}
	} catch (error) {
		// Unexpected error
		const payload = new Payload(false, error.message);
		return response.status(500).json(payload);
	}

	// Create user object
	const user = new User({
		username: username,
		password: password
	});

	// encrypt the password and save the user object
	try {
		await user.save();
	}
	catch (error) {
		// Unexpected error
		const payload = new Payload(false, error.message);
		return response.status(500).json(payload);
	}

	const payload = new Payload(true, 'Successfully created user', user.getDetail());

	return response.status(201).json(payload);
};