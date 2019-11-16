const jwt = require('jsonwebtoken');
const User = require('../auth/model/user');

module.exports = async (req, res, next) => {
    const authToken = req.headers["auth-token"];
    if (!authToken) return next();
    
    // Removing 'Bearer '
    const decoded = jwt.decode(authToken.substring(7));
    const user = await User.findById(decoded._id, 'username email _id password');
    req.user = user;
    next();
}