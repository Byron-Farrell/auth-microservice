const DEFAULT_BASE_ROLES = require('./defaultBaseRoles');

const DEFAULT_ROLES = {
	admin: {
		name: 'admin',
		base: DEFAULT_BASE_ROLES.admin
	},
	manager: {
		name: 'manager',
		base: DEFAULT_BASE_ROLES.manager
	},
	user: {
		name: 'user',
		base: DEFAULT_BASE_ROLES.user
	}
};

module.exports = DEFAULT_ROLES;