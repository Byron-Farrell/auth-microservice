/**
 * Represents a json response object.
 * @constructor
 * @param {boolean} success - The request was successful or not.
 * @param {string} message - Message describing the response.
 * @param {Object} data - Any Object to be included on the response.
 */
function Payload (success, message, data=undefined) {
	this.success = success;
	this.message = message;
	this.payload = {};

	if (data !== undefined) {
		this.payload.data = data;
	}
}

/**
 * Adds an object containing the field and message of the error to this.errors.
 * @param {string} field - The field the error occurred on.
 * @param {string} message - The error message.
 */
Payload.prototype.addError = function (field, message) {

	// If payload does not have an error array create one
	if (!Object.hasOwn(this.payload, 'errors')) {
		this.payload.errors = [];
	}

	this.payload.errors.push({field, message});
};

module.exports = Payload;