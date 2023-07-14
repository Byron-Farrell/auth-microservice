const { BaseRole } = require('./models/BaseRole');
const { Role } = require('./models/Role');
const { Permission } = require('./models/Permission');

const BASE_ROLES = require('./constants/baseRoles');
const ROLES = require('./constants/roles');
const PERMISSIONS = require('./constants/permissions');


exports.setup = async () => {

    for (const [key, permission] of Object.entries(PERMISSIONS)) {
        // check if permission exists
        const permissionExists = await Permission.findOne({name: permission.name});

        if (!permissionExists) {
            const newPermission = new Permission({
                name: permission.name,
                description: permission.description
            });

            await newPermission.save();
        }

    }

    for (const [key, baseRole] of Object.entries(BASE_ROLES)) {

        const baseRoleExists = await BaseRole.findOne({name: baseRole.name});

        if (!baseRoleExists) {
            const newBaseRole = new BaseRole({
                name: baseRole.name
            })

            for (const permission of baseRole.permissions) {
                const permissionModel = await Permission.findOne({name: permission.name});

                if (permissionModel) {
                    newBaseRole.permissions.push(permissionModel)
                } else {
                    // TODO: log this instead of printing to STDOUT
                    console.log(`Permissions ${permission.name} does not exists.`)
                }
            }

            await newBaseRole.save()
        }
    }

    for (const [key, role] of Object.entries(ROLES)) {

        const roleExists = await Role.findOne({name: role.name});
        const baseRoleModel = await BaseRole.findOne({name: role.base.name});

        if (!roleExists && baseRoleModel) {

            const newRole = new Role({
                baseRole: baseRoleModel,
                name: role.name
            })

            baseRoleModel.permissions.forEach(permission => {
                newRole.permissions.push(permission)
            })

            await newRole.save()
        }
    }
}