const User = require('../model/user');

exports.register = async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    const user = new User({
        name, email, password
    });

    // Check if the user already exist
    const userExist = await User.findOne({ email });
    if (userExist) {
        return res.status(401).json({ err: "User with this email already exist" });
    }

    try {
        await user.save();
        res.status(201).json({ success: "User successfully created" });
    } catch(e) {
        console.log(e);
        res.status(400).json(e);
    }
}