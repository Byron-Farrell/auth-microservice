const DEFAULT_BASE_ROLES = require('../constants/defaultBaseRoles');
const { BaseRole } = require('../models/BaseRole');
const { Permission } = require('../models/Permission');


module.exports = async () => {

    for (const baseRole of Object.values(DEFAULT_BASE_ROLES)) {

        let permissions = [];

        for (const permission of baseRole.permissions) {
            const permissionModel = await Permission.findOne({name: permission.name});

            if (permissionModel) {
                permissions.push(permissionModel);
            } else {
                // TODO: log this instead of printing to STDOUT
                console.log(`Permissions ${permission.name} does not exists.`);
            }
        }

        const filter = { name: baseRole.name };
        const update = { name: baseRole.name, permissions: permissions };
        const options = { upsert: true };

        await BaseRole.findOneAndUpdate(filter, update, options);
    }
};

