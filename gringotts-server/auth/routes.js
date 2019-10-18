const router = require('express').Router();

const { register, login } = require('./controller/auth');
const { registerValidate, loginValidate } = require('./validation');

router.post('/register', registerValidate, register);
router.post('/login', loginValidate, login);

module.exports = router;