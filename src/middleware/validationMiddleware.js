const Payload = require('../models/Payload');
const { validations, routes } = require('../routes/routesConfig')

exports.validations = (request, response, next) => {

	const path = routes.find(route => {
		const regex = new RegExp('^' + route.path.replace(/:[a-zA-Z]+/g, '([^/]+)') + '$');
		if (regex.test(request.path) && route.method === request.method) {
			return true
		}

		return false
	})

	if (!path) {
		// no match
		// TODO: log this, all routes should have a validation object. maybe reject request?
		next()
	}

	const requiredFields = validations[path].fields.required;

	let requestBodyFields = requiredFields.filter(field => field in request.body)

	if (requestBodyFields.length !== requiredFields.length) {
		//missing fields
		const missingFields = requiredFields.filter(field => !(field in requestBodyFields));

		const payload = new Payload(false, 'Validation error. Missing fields');
		for (missingField in missingFields) {
			payload.addError(missingField, `${missingField} is a required field`);
		}
	}
	// Missing field(s). Create an error payload


	next();
};
