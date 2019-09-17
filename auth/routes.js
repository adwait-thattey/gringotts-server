const router = require('express').Router();

const { register } = require('./controller/auth');

router.post('/register', register);

router.post('/login', (req, res) => {

})

module.exports = router;