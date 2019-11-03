const router = require('express').Router();
const { createNewEngine } = require('./controllers/engine');

// router.get('/engines', );
// router.get('/engines/:cred_engine_type/types', );
router.post('/engines/:engine_type', createNewEngine);

module.exports = router;