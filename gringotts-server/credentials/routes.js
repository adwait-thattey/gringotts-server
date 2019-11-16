const router = require('express').Router();
const { addCustomCategory, deleteCategory, getSpecificEngine,
    createCreds, removeCreds, getCreds } = require('./controllers/engine');

// router.get('/engines', );
// router.get('/engines/:cred_engine_type/types', );
router.post('/category/:engineName', addCustomCategory);
router.delete('/category/:engineName', deleteCategory);

router.delete('/secret/:engineName/:categoryName', removeCreds)
router.post('/secret/:engineName/:engineType/:categoryName', createCreds)
router.get('/secret/:engineName/:categoryName', getCreds);

router.get('/:engine_name', getSpecificEngine);

module.exports = router;