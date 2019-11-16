const router = require('express').Router();
const { createNewEngine, getAllEngines } = require('./controller');

// Add isAuth middleware
router.post('/:engine_type', createNewEngine);
router.get('', getAllEngines);

module.exports = router;