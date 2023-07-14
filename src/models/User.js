const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Schema, model, mongoose } = require('mongoose');
const authConfig = require('../config/auth');
const { Role } = require('./Role');

/**
 * A mongoose schema that defines a user in the system
 *
 * @type {module:mongoose.Schema}
 */
const userSchema = new Schema({
	username: {
		type: String,
		lowercase: true,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true
	},
	role: {
		type: mongoose.Types.ObjectId,
		ref: 'Role',
		default: null
	}
});


// MongoDB pre save hook that hashes all users passwords before they are saved
userSchema.pre('save', async function(next) {

	if (this.role == null) {
		this.role = await Role.findOne({name: 'user'})
	}

	// Password has not been modified. No need to hash password.
	if (!this.isModified('password')) {
		return next();
	}

	// Hash users password
	try {
		const salt = await bcrypt.genSalt(authConfig.SALT_ROUNDS);
		this.password = await bcrypt.hash(this.password, salt);
	} catch (error) {
		next(error);
	}
});


userSchema.statics.exists = async function (username) {
	const count = await User.countDocuments({ username: username });

	return count > 0;
};


userSchema.methods.generateToken = function () {
	const options = {
		algorithm: authConfig.JWT_ENCRYPTION,
		expiresIn: authConfig.JWT_EXPIRES_IN
	};

	return jwt.sign(this.getDetail(), authConfig.JWT_SECRET_KEY, options);
};


/**
 * A user schema instance method that returns an object
 * containing the users details.
 *
 * @returns {{id: *, username: *}}
 */
userSchema.methods.getDetail = function() {
	const { _id, username, role } = this;

	return { id: _id, username: username, role: role.name };
};


/**
 * A user schema instance method that returns a sanitized
 * object of the user model. A sanitized object is an object
 * containing all the user fields except for sensitive fields
 * e.g. password
 *
 * @returns {{username: *}}
 */
userSchema.methods.getSanitizedUser = function() {
	const { username } = this.toObject();
	return { username };
};


/**
 * Compares a password string against the users hashed password
 *
 * @param password {string}
 * @returns {void|*}
 */
userSchema.methods.comparePasswords = function (password) {
	return bcrypt.compare(password, this.password);
};


// Creating user model object
const User = model('User', userSchema);


/**
 * User model
 *
 * @type {module:mongoose.model}
 */
module.exports = User;