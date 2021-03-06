const config = require('../../config');
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.header('auth-token');
    
    if (!token) return res.status(401).send("Access denied");
    
    try {
        const verified = jwt.verify(token, config.TOKEN_SECRET);
        req.user = verified;
        next();
    } catch(e) {
        return res.status(400).send("Invalid Token");
    }
};

exports.verifyToken = verifyToken;