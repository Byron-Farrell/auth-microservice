const { Schema, model, mongoose } = require('mongoose');

const BaseRoleSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        maxLength: 255
    },
    permissions: [{type: mongoose.Types.ObjectId, ref: "Permission"}]
})

const BaseRole = model('BaseRole', BaseRoleSchema);

module.exports = {
    BaseRoleSchema,
    BaseRole
};