const { Schema, model, mongoose } = require('mongoose');

const RoleSchema = new Schema({
	baseRole: {
		type: mongoose.Types.ObjectId,
		ref: 'BaseRole'
	},
	name: {
		type: String,
		required: true,
		unique: true,
		maxLength: 255
	},
	permissions: [{type: mongoose.Types.ObjectId, ref: 'Permission'}]
});

const Role = model('Role', RoleSchema);

module.exports = {
	RoleSchema,
	Role
};