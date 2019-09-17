const Joi = require('@hapi/joi');

exports.registerValidate = async (req, res, next) => {
    const user = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    }

    const schema = Joi.object({
        name: Joi.string().min(6).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    })

    const { error } = await schema.validate(user);

    if (error && error.details.length > 0) {
        return res.status(400).json({ err: error.details[0].message });
    }
    next();
}

exports.loginValidate = async (req, res, next) => {
    const user = {
        email: req.body.email,
        password: req.body.password
    }

    const schema = Joi.object({
        email: Joi.string().min(6).required(),
        password: Joi.string().min(6).required()
    })

    const { error } = await schema.validate(user);

    if (error && error.details.length > 0) {
        return res.status(400).json({ err: error.details[0].message });
    }
    next();
}