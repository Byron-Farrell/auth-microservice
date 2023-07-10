const Payload = require('../models/Payload');

exports.handleError = (error, request, response, next) => {

	const payload = new Payload(false, '')

	if (error instanceof SyntaxError && 'body' in error && error.type === 'entity.parse.failed') {
		payload.message = 'Unable to parse JSON in request body';
		return response.status(400).json(payload);
	}

	if (error.name === 'CastError') {
		payload.message = 'Invalid user ID';
		payload.addError('id', `${request.params.userId} is not a valid user ID`)

		return response.status(400).json(payload);
	}

	payload.message = 'Unexpected server error';
	return response.status(500).json(payload);
}
