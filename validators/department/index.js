const Joi = require("joi");

class departmentValidator {
    static createDepartment() {
        return Joi.object({
            name: Joi.string().required(),
            // staff: Joi.array().required(),
        })
    }

}

module.exports = { departmentValidator }