const jwt = require('jsonwebtoken');
const User = require('../auth/model/user');

module.exports = async (req, res, next) => {
    const authToken = req.headers["auth-token"];
    if (!authToken) return next();

    // Removing 'Bearer '
    const decoded = jwt.decode(authToken.substring(7));
    let user;
    try {
        user = await User.findById(decoded._id, 'username email _id password');
    } catch(e) {
        console.log(e);
    }
    req.user = user;
    next();
}