const { Schema, model } = require("mongoose");

const DepartmentSchema = new Schema({
    name: {
        type: String,
        unique: true,
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
    // staff: [{
    //     type: Schema.Types.ObjectId,
    //     ref: 'User'
    // }]
})

const Department = model('Department', DepartmentSchema)

module.exports = { Department }