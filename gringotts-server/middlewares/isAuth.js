const jwt = require('jsonwebtoken');
const config = require('../config');

exports.isAuth = (req, res, next) => {
    const jwtToken = req.get('auth-token');
    try {
        const decoded = jwt.verify(jwtToken, config.TOKEN_SECRET);
    } catch(e) {
        return res.status(401).send("Unauthorized");
    }
    next();
}