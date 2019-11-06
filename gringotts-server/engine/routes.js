const router = require('express').Router();
const { createNewEngine } = require('./controller');

// Add isAuth middleware
router.post('/:engine_type', createNewEngine);

module.exports = router;