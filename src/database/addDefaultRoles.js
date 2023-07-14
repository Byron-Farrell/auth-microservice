const DEFAULT_ROLES = require('../constants/defaultRoles');

const { Role } = require('../models/Role');
const { BaseRole } = require('../models/BaseRole');

module.exports = async () => {
    for (const role of Object.values(DEFAULT_ROLES)) {

        const baseRoleModel = await BaseRole.findOne({name: role.base.name});

        if (baseRoleModel) {
            const filter = { name: role.name };
            const update = { name: role.name, baseRole: baseRoleModel, permissions: baseRoleModel.permissions };
            const options = { upsert: true };

            await Role.findOneAndUpdate(filter, update, options);
        }
        else {
            // TODO: add this to a logger instead of printing to STDOUT
            console.log(`base role ${role.base.name} does not exists.`);
        }
    }
};
