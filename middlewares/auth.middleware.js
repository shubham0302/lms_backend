const ResponseWraper = require("../helpers/response.helper");
const { JWTVerify } = require("../utils/auth.utils");

const verifyToken = (req, res, next) => {
    const { authorization } = req.headers;
    const response = new ResponseWraper(res);

    if (!authorization) {
        response.forbidden('No token provided!');
        return;
    }

    JWTVerify(authorization, (err, decoded) => {
        if (err) {
            console.log("token error", err);
            response.unauthorized('Invalid Token!');
            return;
        }
        // console.log(decoded, "decoded");
        const body = { ...req.body, decodedFirstName: decoded.firstName, decodedLastName: decoded.lastName, decodedEmail: decoded.email, decodedPhonenumber: decoded.phoneNumber, decodedRole: decoded.role, decodedDepartment: decoded.department, decodedId: decoded.userId };
        req.body = body;
        next();
    });
};


module.exports = {
    verifyToken
}