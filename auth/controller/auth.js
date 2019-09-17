const User = require('../model/user');

exports.register = async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    const user = new User({
        name, email, password
    });

    try {
        await user.save();
        res.status(201).json({ success: "User successfully created" });
    } catch(e) {
        console.log(e);
        res.status(400).json(e);
    }
}