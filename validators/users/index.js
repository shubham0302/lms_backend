const Joi = require("joi");

class UserValidator {
    static register() {
        return Joi.object({
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            email: Joi.string().required().email(),
            password: Joi.string().required(),
            phoneNumber: Joi.string().required(),
            role: Joi.string().required(),
            department: Joi.array(),
        })
    }

    static login() {
        return Joi.object({
            email: Joi.string().required().email(),
            password: Joi.string().required()
        })
    }

    static changePassword() {
        return Joi.object({
            oldPassword: Joi.string().required(),
            newPassword: Joi.string().required()
        })
    }

    static forgotPassword() {
        return Joi.object({
            email: Joi.string().required().email()
        })
    }

    static verifyOtp() {
        return Joi.object({
            email: Joi.string().required().email(),
            otp: Joi.string().required()
        })
    }

    static setNewPassword() {
        return Joi.object({
            userId: Joi.string().required(),
            password: Joi.string().required()
        })
    }

    static editProfile() {
        return Joi.object({
            firstName: Joi.string(),
            lastName: Joi.string(),
            phoneNumber: Joi.string(),
            address: Joi.string(),
            profile: Joi.string(),
        })
    }
}

module.exports = { UserValidator }