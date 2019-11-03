const router = require('express').Router();
const { addCustomCategory } = require('./controllers/engine');

// router.get('/engines', );
// router.get('/engines/:cred_engine_type/types', );
router.post('/category/:engineName', addCustomCategory);

module.exports = router;