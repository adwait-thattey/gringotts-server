const config = require('../../config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const vault = require('../../vault');
const User = require('../model/user');

const {VaultError} = vault.errors;

exports.register = async (req, res) => {
    const username = req.body.username;
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
        username, email, password: hashPassword, is_superuser: false
    });

    try {
        await user.save();
    } catch (e) {
        res.status(400).json(e);
    }
    try {
        await vault.api.createUser(user)
    } catch (err) {
        if( err instanceof vault.errors.VaultError) {
            if (err instanceof vault.errors.VaultInternalError ) {
                res.status(500).json({
                    "message": "Internal Server Error",
                })
            }

            res.status(err.status || 500).json({
                "message": err.message
            })
        }
    }
    res.status(201).json({ success: "User successfully created" });
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