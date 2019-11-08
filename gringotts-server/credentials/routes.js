const router = require('express').Router();
const { addCustomCategory, createCreds } = require('./controllers/engine');

// router.get('/engines', );
// router.get('/engines/:cred_engine_type/types', );
router.post('/category/:engineName', addCustomCategory);
router.post('/create/:engineName/:categoryName', createCreds)

module.exports = router;