const router = require('express').Router();
const { createEngine } = require('./controller');

// Add isAuth middleware
router.post('/', createEngine);

module.exports = router;