const Joi = require("joi");

class subModuleValidator {
    static createSubModule() {
        return Joi.object({
            moduleId: Joi.string().required(),
            subModule: Joi.array().items(Joi.object({
                subModuleName: Joi.string().required(),
                subModuleDescription: Joi.string().required(),
                videoUrl: Joi.string().required(),
                thumbnailUrl: Joi.string().required(),
                duration: Joi.string().required(),
            })).min(1)
        })
    }


    static editSubModule() {
        return Joi.object({
            subModuleId: Joi.string().required(),
            subModuleName: Joi.string(),
            subModuleDescription: Joi.string(),
            videoUrl: Joi.string(),
            duration: Joi.string(),
            thumbnailUrl: Joi.string()
        })
    }

    static deleteSubModule() {
        return Joi.object({
            subModuleId: Joi.string().required()
        })
    }


}

module.exports = { subModuleValidator }