const PERMISSIONS = require('./permissions');

const BASE_ROLES = {
    admin: {
        name: 'admin',
        permissions: [
            PERMISSIONS.can_list_user,
            PERMISSIONS.can_get_user,
            PERMISSIONS.can_update_user,
            PERMISSIONS.can_delete_user
        ]
    },
    manager: {
        name: 'manager',
        permissions: [
            PERMISSIONS.can_list_user,
            PERMISSIONS.can_get_user,
            PERMISSIONS.can_update_user,
            PERMISSIONS.can_delete_user
        ]
    },
    user: {
        name: 'user',
        permissions: [
            PERMISSIONS.can_get_user,
            PERMISSIONS.can_update_user,
            PERMISSIONS.can_delete_user
        ]
    },
}

module.exports = BASE_ROLES;