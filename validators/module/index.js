const Joi = require("joi");

class moduleValidator {
    static createModule() {
        return Joi.object({
            name: Joi.string().required(),
            description: Joi.string().required(),
            departmentId: Joi.string().required(),
            thumbnail: Joi.string().required(),
            tags: Joi.array().required(),
            subModule: Joi.array().items(Joi.object({
                subModuleName: Joi.string().required(),
                subModuleDescription: Joi.string().required().allow(''),
                thumbnailUrl: Joi.string().required(),
                videoUrl: Joi.string().required(),
                duration: Joi.string().required(),
                sort: Joi.number().required()
            })).min(1)
        })
    }

    static editModule() {
        return Joi.object({
            moduleId: Joi.string().required(),
            name: Joi.string(),
            description: Joi.string(),
            departmentId: Joi.string(),
            thumbnail: Joi.string(),
            tags: Joi.array(),
        })
    }


    static deleteModule() {
        return Joi.object({
            moduleId: Joi.string().required()
        })
    }
}

module.exports = { moduleValidator }