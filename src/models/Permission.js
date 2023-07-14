const { Schema, model } = require('mongoose');

const PermissionSchema = new Schema({
	name: {
		type: String,
		required: true,
		unique: true,
		maxLength: 255
	},
	description: {
		type: String,
		required: false,
		unique: false,
		maxLength: 255
	}
});

const Permission = new model('Permission', PermissionSchema);

module.exports = {
	PermissionSchema,
	Permission
};