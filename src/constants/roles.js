const BASE_ROLES = require('./baseRoles');

const ROLES = {
    admin: {
        name: 'admin',
        base: BASE_ROLES.admin
    },
    manager: {
        name: 'manager',
        base: BASE_ROLES.manager
    },
    user: {
        name: 'user',
        base: BASE_ROLES.user
    }
};

module.exports = ROLES