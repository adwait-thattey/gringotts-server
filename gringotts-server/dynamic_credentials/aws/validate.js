const Joi = require('@hapi/joi');

exports.configureAWSValidate = async (req, res, next)=>{
    console.log("AWS validator for parameters")
    const data ={
        access_key:req.body.access_key,
        secret_key:req.body.secret_key,
        account_name:req.body.account_name
    }

    const schema =Joi.object({
        access_key: Joi.string().required(),
        secret_key: Joi.string().required(),
        account_name: Joi.string().required()    
    })

    const {error} = await schema.validate(data);

    if (error && error.details.length > 0) {
        return res.status(400).json({ err: error.details[0].message });
    }

    sub_string = ' '
    next();
}
