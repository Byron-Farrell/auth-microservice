const DEFAULT_PERMISSIONS = require('./defaultPermissions');

const DEFAULT_BASE_ROLES = {
	admin: {
		name: 'admin',
		permissions: [
			DEFAULT_PERMISSIONS.can_list_user,
			DEFAULT_PERMISSIONS.can_get_user,
			DEFAULT_PERMISSIONS.can_update_user,
			DEFAULT_PERMISSIONS.can_delete_user
		]
	},
	manager: {
		name: 'manager',
		permissions: [
			DEFAULT_PERMISSIONS.can_list_user,
			DEFAULT_PERMISSIONS.can_get_user,
			DEFAULT_PERMISSIONS.can_update_user,
			DEFAULT_PERMISSIONS.can_delete_user
		]
	},
	user: {
		name: 'user',
		permissions: [
			DEFAULT_PERMISSIONS.can_get_user,
			DEFAULT_PERMISSIONS.can_update_user,
			DEFAULT_PERMISSIONS.can_delete_user
		]
	},
};

module.exports = DEFAULT_BASE_ROLES;