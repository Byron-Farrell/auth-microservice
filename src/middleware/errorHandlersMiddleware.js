const Payload = require('../models/Payload');


exports.json = (error, request, response, next) => {

	if (error instanceof SyntaxError && 'body' in error && error.type === 'entity.parse.failed') {
		let payload = new Payload(false, 'Unable to parse JSON in request body');
		return response.status(400).json(payload);
	}
};
