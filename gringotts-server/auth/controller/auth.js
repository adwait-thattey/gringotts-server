const config = require('../../config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../model/user');

exports.register = async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    // Check if the user already exist
    const userExist = await User.findOne({ email });
    if (userExist) {
        return res.status(401).json({ err: "User with this email already exist" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const user = new User({
        name, email, password: hashPassword
    });

    try {
        await user.save();
        res.status(201).json({ success: "User successfully created" });
    } catch (e) {
        res.status(400).json(e);
    }
}

exports.login = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ err: "Email or Password is wrong" });
        }

        // Check if password is correct
        const validPass = await bcrypt.compare(password, user.password);

        if (!validPass) {
            return res.status(400).json({ err: "Email or Password is wrong" });
        }
        // Create and assign token
        const token = jwt.sign({ _id: user._id }, config.TOKEN_SECRET, { expiresIn: 3600 });
        res.header('auth-token', token).send(token);

    } catch(e) {
        return res.status(400).send(e);
    }
}