const connect = require('./connect');
const addDefaultPermissions = require('./addDefaultPermissions');
const addDefaultBaseRoles = require('./addDefaultBaseRoles');
const addDefaultRoles = require('./addDefaultRoles');

module.exports = async () => {
    await connect();
    await addDefaultPermissions();
    await addDefaultBaseRoles();
    await addDefaultRoles();
};