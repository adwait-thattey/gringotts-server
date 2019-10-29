const jwt = require('jsonwebtoken');
const config = require('../config');

exports.isAuth = (req, res, next) => {
    const jwtToken = req.get('auth-header');

    try {
        const decoded = jwt.verify(jwtToken, config.TOKEN_SECRET);
        console.log(decoded);
    } catch(e) {
        return res.status(401).send("Unauthorized");
    }
    next();
}