const { Schema, model } = require("mongoose");

const CertificateSchema = new Schema({
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
    pass: {
        type : Schema.Types.Boolean,
        // ref: 'Module'
        default: false
    },
    obtain: {
        type: Number,
        default: 0,
    },
    total: {
        type: Number,
        default: 0,
    },
    totalPassQuiz: {
        type: Number,
        default: 0,
    },
    totalQuiz: {
        type: Number,
        default: 0,
    },
    // staff: [{
    //     type: Schema.Types.ObjectId,
    //     ref: 'User'
    // }]
},{
    timestamps: true
})

const Certificate = model('Certificate', CertificateSchema)

module.exports = { Certificate }