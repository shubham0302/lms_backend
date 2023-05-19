const ResponseWraper = require("../helpers/response.helper");

function validationMiddleware(Validator) {
    return async (req, res, next) => {
        const response = new ResponseWraper(res);
        // console.log(req.body);
        try {
            if (Validator) {
                await Validator.validateAsync(req.body);
            }
            return next();
        } catch (error) {
            return response.badRequest(error.details[0].message);
        }
    };
}

module.exports = { validationMiddleware };