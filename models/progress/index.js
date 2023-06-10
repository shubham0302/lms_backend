const { Schema, model } = require("mongoose");

const ProgressSchema = new Schema({
    company: {
        type : Schema.Types.ObjectId,
        ref: 'User'
    },
    trainee: {
        type : Schema.Types.ObjectId,
        ref: 'User'
    },
    module: {
        type : Schema.Types.ObjectId,
        ref: 'Module'
    },
    submodule: {
        type : Number,
        default: 0,
    },
    total: {
        type : Number,
        default: 0,
    },
},{
    timestamps: true
})

const Progress = model('Progress', ProgressSchema)

module.exports = { Progress }