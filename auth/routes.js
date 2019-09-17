const router = require('express').Router();

const { register } = require('./controller/auth');
const { registerValidate } = require('./validation');

router.post('/register', registerValidate, register);

router.post('/login', (req, res) => {

})

module.exports = router;