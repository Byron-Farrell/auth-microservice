const { Permission } = require('../models/Permission');
const DEFAULT_PERMISSIONS = require('../constants/defaultPermissions');


module.exports = async () => {

    for (const permission of Object.values(DEFAULT_PERMISSIONS)) {

        const filter = { name: permission.name };
        const update = { name: permission.name, description: permission.description };
        const options = { upsert: true };

        await Permission.findOneAndUpdate(filter, update, options);

    }
};