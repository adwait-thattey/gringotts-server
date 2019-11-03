const router = require('express').Router();
const { createEngine } = require('./controller');

// Add isAuth middleware
router.post('/:engine_type', createNewEngine);

module.exports = router;