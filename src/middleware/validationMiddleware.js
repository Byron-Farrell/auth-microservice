const Payload = require('../models/Payload');
const { routes } = require('../routes/routesConfig')

exports.validations = (request, response, next) => {


	// Convert routes object to an array
	const routesArray = Object.entries(routes).map(element => {
		return element[1]
	})

	const route = routesArray.find(route => {
		const regex = new RegExp('^' + route.path.replace(/:[a-zA-Z]+/g, '([^/]+)') + '$');
		if (regex.test(request.path) && route.method === request.method) {
			return true
		}

		return false;
	})

	const { path, name } = route;

	const validationFields = routes[name]?.validations?.fields;

	if (!path) {
		// no match
		// TODO: log this, all routes should have a validation object. maybe reject request?
		next()
	}

	if (request.method === 'POST') {
	
		// Get all required fields
		let requiredFields = []

		if (validationFields) {
			// Create an array of all fields
			const fields = Object.keys(validationFields)

			// Get all required fields
			requiredFields = fields.filter(field => routes[name].validations.fields[field].required)
		}

		// Checking if validation object has required fields.
		if (requiredFields.length > 0) {

			// Create a list of fields. If the field in the request body is also in the requiredFields array
			// Add it to the requestBodyFields array.
			let requestBodyFields = requiredFields.filter(field => field in request.body)

			// Checking if body has all required fields
			if (requestBodyFields.length !== requiredFields.length) {
				//missing fields
				const missingFields = requiredFields.filter(field => !requestBodyFields.includes(field));

				const payload = new Payload(false, 'Validation error. Missing fields');
				for (index in missingFields) {
					payload.addError(missingFields[index], `${missingFields[index]} is a required field`);
				}

				return response.status(404).json(payload)
			}
		}
	}
	

	if (request.method === 'PATCH') {

		const hasBody = Object.hasOwn(request, 'body')
		const bodyIsEmpty = hasBody && Object.keys(request.body).length === 0 || !hasBody

		if (bodyIsEmpty) {
			const payload = new Payload(
				true,
				'Request body was empty'
			)
			return response.status(400).json(payload)
		}

		let invalidFields = []

		if (validationFields) {
			// Create an array of all fields
			const fields = Object.keys(validationFields)

			// Get all patchable fields
			const patchableFields = fields.filter(field => routes[name].validations.fields[field].patchable)

			const requestBodyFields = Object.keys(request.body)

			invalidFields = requestBodyFields.filter(field => !patchableFields.includes(field))
		}

		if (invalidFields.length > 0) {
			const payload = new Payload(false, 'Validation error')

			for (index in invalidFields) {
				payload.addError(invalidFields[index], 'Field not allowed in patch method')
			}

			return response.status(405).json(payload)
		}
	}

	next();
};
