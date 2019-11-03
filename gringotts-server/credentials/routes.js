const router = require('express').Router();
const { createNewEngine, addCustomCategory } = require('./controllers/engine');

// router.get('/engines', );
// router.get('/engines/:cred_engine_type/types', );
router.post('/engines/credentials/category/:engine_name', addCustomCategory);

module.exports = router;