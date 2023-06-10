const { Schema, model } = require("mongoose");

const SubModuleSchema = new Schema({
    subModuleName: String,
    subModuleDescription: String,
    videoUrl: String,
    duration: String,
    thumbnailUrl: String,
    sort: Number,
    module: {
        type: Schema.Types.ObjectId,
        ref: 'Module'
    },
    createdDate: Schema.Types.Date,

})

const SubModule = model('SubModule', SubModuleSchema)
module.exports = { SubModule }


