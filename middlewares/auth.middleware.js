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

function verifyRole({role = '', isAdmin = false, isCompany = false}){
    return (req, res, next)=>{
        const response = new ResponseWraper(res);
        const {decodedRole} = req.body;
        if(isAdmin && decodedRole.toLowerString() !== 'admin'){
            return response.forbidden('Only admin can access this');
        }
        if(isCompany && (decodedRole.toLowerString() !== 'company' || decodedRole.toLowerString() !== 'admin')){
            return response.forbidden('Only company can access this');
        }
        if(decodedRole !== role){
            return response.forbidden(`Only ${role} can access this`);
            // return next();
        }
        return next();
    }
}

module.exports = {
    verifyToken,
    verifyRole
}