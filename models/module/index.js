const { Schema, model } = require("mongoose");

const ModuleSchema = new Schema({
    name: String,
    description: String,
    thumbnail: String,
    tags: [{ type: String }],
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    department: {
        type: Schema.Types.ObjectId,
        ref: 'Department'
    },
    totalSubModules: { type: Number, default: 0 },
    createdDate: Schema.Types.Date
})

const Modules = model('Module', ModuleSchema)
module.exports = { Modules }