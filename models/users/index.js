const { Schema, model } = require("mongoose");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { SALT_SECRET, JWT_SECRET } = require("../../config/environment.config");

const UserSchema = new Schema({
    firstName: String,
    lastName: String,
    email: {
        type: String,
        unique: true
    },
    password: String,
    otp: {
        type: String,
        default: ''
    },
    expireOtp: {
        type: String,
        default: ''
    },
    phoneNumber: {
        type: String,
        unique: true
    },
    address: {
        type: String,
        default: ''
    },
    profile: {
        type: Object
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    role: {
        type: String,
        enum: ['admin', 'company', 'trainee'],
        default: 'trainee'
    },
    department: [{
        type: Schema.Types.ObjectId,
        ref: 'Department'
    }]
},
    {
        toJSON: {
            transform: (doc, ret) => {
                const { otp, expireOtp, password, ...rest } = ret;
                return rest;
            },
            versionKey: false,
        },
    },)

UserSchema.pre('save', async function encrypt(next) {
    if (this.isModified('password')) {
        const hash = await this.encryptPassword(this.password)
        this.password = hash;
    }
    return next()
});

UserSchema.methods = {
    async authenticate(plainTextPassword) {
        try {
            return await bcrypt.compare(plainTextPassword, this.password)
        } catch (error) {
            console.log(error);
            return false;
        }
    },
    encryptPassword(password) {
        return bcrypt.hash(password, bcrypt.genSaltSync(Number(SALT_SECRET)))
    },
    generateToken() {
        return jwt.sign({
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            role: this.role,
            userId: this._id,
            phoneNumber: this.phoneNumber
        }, JWT_SECRET, {
            expiresIn: 24 * 60 * 60
        })
    }
}

const User = model('User', UserSchema)
module.exports = { User }