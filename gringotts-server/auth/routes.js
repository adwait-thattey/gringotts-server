const router = require('express').Router();

const { register, login, authByFace } = require('./controller/auth');
const { registerValidate, loginValidate } = require('./validation');

router.post('/register', registerValidate, register);
router.post('/login', loginValidate, login);
router.post('/authByFace', authByFace)

module.exports = router;