require('dotenv').config();

/**
 * The number of salt rounds exponentially increases the time taken
 * during the hashing process and computational power. A higher salt
 * helps prevent brute force attacks.
 *
 * @type {number}
 */
const SALT_ROUNDS = 10;

/**
 * String representing the life span of a JWT token.
 *
 * @type {string}
 */
const JWT_EXPIRES_IN = '24h';

/**
 * Key used in the symmetric encryption algorithm to encode and
 * decode JWT tokens.
 *
 * @type {string}
 */
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

/**
 * Encryption algorithm used to encrypt JSON web tokens.
 *
 * @type {string}
 */
const JWT_ENCRYPTION = 'HS256';

/**
 * Exported variables.
 *
 * @type {Object}
 * @property {number} SALT_ROUNDS - Number of hashing iterations 2^n.
 * @property {string} JWT_EXPIRES_IN - JWT expires in.
 * @property {string} JWT_SECRET_KEY - JWT secret key.
 * @property {string} JWT_ENCRYPTION - JWT encryption algorithm.
 */
module.exports = {
	SALT_ROUNDS,
	JWT_EXPIRES_IN,
	JWT_SECRET_KEY,
	JWT_ENCRYPTION
};