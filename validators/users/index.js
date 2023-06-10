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
            address: Joi.string(),
            profile: Joi.object()
        })
    }
    static createCompany() {
        return Joi.object({
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            email: Joi.string().required().email(),
            password: Joi.string().required(),
            phoneNumber: Joi.string().required(),
            role: Joi.string(),
            department: Joi.array(),
            address: Joi.string(),
            profile: Joi.object()
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
            profile: Joi.object(),
            email: Joi.string()
        })
    }

    static editTrainee() {
        return Joi.object({
            userId: Joi.string().required(),
            firstName: Joi.string(),
            lastName: Joi.string(),
            email: Joi.string(),
            phoneNumber: Joi.string(),
            password: Joi.string(),
            department: Joi.string(),
            address: Joi.string(),
            profile: Joi.object()
        })
    }
}

module.exports = { UserValidator }