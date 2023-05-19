const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/environment.config');

const JWTVerify = (authorization, callback) => {
    const token = authorization.replace(/bearer /i, '');
    console.log(token);
    jwt.verify(token, JWT_SECRET, callback);
};

module.exports = {
    JWTVerify
}